import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1632896106300 implements MigrationInterface {
    name = 'Migration1632896106300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue" DROP CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7"`);
        await queryRunner.query(`ALTER TABLE "course_staff" DROP CONSTRAINT "FK_7e0675201d7cc340eccbca792f7"`);
        await queryRunner.query(`ALTER TABLE "queue" ADD CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_staff" ADD CONSTRAINT "FK_7e0675201d7cc340eccbca792f7" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_staff" DROP CONSTRAINT "FK_7e0675201d7cc340eccbca792f7"`);
        await queryRunner.query(`ALTER TABLE "queue" DROP CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7"`);
        await queryRunner.query(`ALTER TABLE "course_staff" ADD CONSTRAINT "FK_7e0675201d7cc340eccbca792f7" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue" ADD CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
