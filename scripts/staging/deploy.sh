#!/bin/bash
set -ex

# Constants
SSH_CONFIG="Host *.eait.uq.edu.au
  StrictHostKeyChecking no
Host *.zones.eait.uq.edu.au
  ProxyJump $UQ_USERNAME@$UQ_NETWORK_HOST
  ForwardAgent yes
"

NODEJS_SERVICE='[Unit]
Description=node.js with express.js
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/nodejs/queue
ExecStart=/usr/bin/node /var/www/nodejs/queue/build/server/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
'

ENV_FILE="PORT=8081
DB_HOST=localhost
DB_USER=queue
DB_PW=queue
DB_NAME=queue
NODE_ENV=production
REDIS_HOST=localhost
REDIS_PORT=6379
"

PUB_KEY=$(ssh-keygen -y -f /opt/atlassian/pipelines/agent/ssh/id_rsa)
ZONE="$1.zones.eait.uq.edu.au"

createZone() {
	local zone_name=$1
	local uq_user=$2
	local zone="$zone_name.zones.eait.uq.edu.au"
	source /etc/profile
	set -x
	if ! triton --act-as=itee inst list -o name | tail -n +2 | grep -q "$zone_name"; then
		echo No zone with existing name found, creating new zone...
		triton --act-as=itee inst create --wait --name "$zone_name" --network zones --metadata uq_users="$uq_user ${ZONE_ADMINS//,/ }" webproject z1-2xlarge
		echo Zone successfully created.
		echo Trying to ssh into zone
		for i in {1..30}; do
			echo "Attempt: $i"
			if nc -z "$zone" 22 >/dev/null 2>/dev/null; then
				echo Zone is ready
				sleep 5
				break
			fi
			sleep 5
		done
		ssh -o "StrictHostKeyChecking=no" -o "UserKnownHostsFile /dev/null" "root@$zone" "
			$(declare -p NODEJS_SERVICE)
			$(declare -f setUpZone)
			setUpZone
		"
	else
		echo "Zone $zone_name already exists"
	fi
	ssh -o "StrictHostKeyChecking=no" -o "UserKnownHostsFile /dev/null" "root@$zone" "
		$(declare -p PUB_KEY)
		$(declare -f setUpZoneUsers)
		uq-add-user $uq_user || true
		setUpZoneUsers $uq_user $ZONE_ADMINS
	"
}

setUpZoneUsers() {
	local uq_user=$1
	set -ex
	for username in ${ZONE_ADMINS//,/ }; do
		uq-add-user "$username" || true
	done
	mkdir -p "/home/$uq_user/.ssh"
	if [ ! -f "/home/$uq_user/.ssh/authorized_keys" ]; then
		touch "/home/$uq_user/.ssh/authorized_keys"
	fi
	if ! grep -q "$PUB_KEY" "/home/$uq_user/.ssh/authorized_keys"; then
		echo Adding public key to zone
		echo "$PUB_KEY" >>"/home/$uq_user/.ssh/authorized_keys"
	else
		echo Public key already added
	fi
}

setUpZone() {
	webprojctl enable nodejs
	webprojctl enable postgres
	webprojctl enable redis
	createdb queue
	createuser queue
	psql -c "alter user queue with password 'queue'"
	psql queue -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
	npm install -g yarn
	echo "$NODEJS_SERVICE" >/etc/systemd/system/nodejs.service
	systemctl daemon-reload
}

setUpService() {
	set -ex
	export GIT_SSH_COMMAND="ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"
	rm -rf /var/www/nodejs/*
	cd /var/www/nodejs
	git clone git@bitbucket.org:elipse-team/queue.git queue
	cd /var/www/nodejs/queue
	git config user.email "$BITBUCKET_BRANCH@no-reply.com"
	git config user.name "$BITBUCKET_BRANCH"
	git checkout "$BITBUCKET_BRANCH"
	git checkout "$BITBUCKET_PR_DESTINATION_BRANCH"
	git merge "$BITBUCKET_BRANCH"
	yarn
	echo "$ENV_FILE" >.env
	yarn build
	yarn migration-run
	echo "$UQ_PW" | sudo -S bash -c "
		$(declare -p WEB_ADMINS)
		$(declare -f setUpDb)
		setUpDb
	"
	echo "$UQ_PW" | sudo -S systemctl restart nodejs
}

setUpDb() {
	for username in ${WEB_ADMINS//,/ }; do
		psql queue <<-SQL
			INSERT INTO public."user" (username, name, email, "isAdmin") VALUES ('$username', '__redacted__', '__redacted__', true)
			ON CONFLICT (username) DO UPDATE SET "isAdmin" = true;
		SQL
	done
	psql queue <<-SQL
		INSERT INTO public.course (code, title, alias) VALUES
			('CSSE1001', 'Introduction to Software Engineering', 'CSSE7030'),
			('CSSE2002', 'Programming in the Large', 'CSSE7023')
			ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id;
	SQL
}

# Start of script
if [ -z "$1" ]; then
	echo No argument supplied
	exit 1
fi

# ssh set up
echo "$SSH_CONFIG" >>~/.ssh/config
eval "$(ssh-agent -s)"
ssh-add /opt/atlassian/pipelines/agent/ssh/id_rsa

# Create and set up zone
# shellcheck disable=SC2029
ssh "$UQ_USERNAME@$UQ_NETWORK_HOST" "
  $(declare -p NODEJS_SERVICE PUB_KEY ZONE_ADMINS)
  $(declare -f setUpZone setUpZoneUsers createZone)
  createZone $1 $UQ_USERNAME
"

# Clone repo on zone and start server
# shellcheck disable=SC2029
ssh "$UQ_USERNAME@$ZONE" "
	$(declare -p BITBUCKET_BRANCH BITBUCKET_PR_DESTINATION_BRANCH ENV_FILE UQ_PW WEB_ADMINS)
	$(declare -f setUpDb setUpService)
	setUpService
"
