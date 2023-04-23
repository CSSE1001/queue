import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1682143358167 implements MigrationInterface {
    name = 'Migration1682143358167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "room"."archived" IS NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "archived" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "archived" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "room"."archived" IS NULL`);
    }

}
