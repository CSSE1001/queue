import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1682143033241 implements MigrationInterface {
    name = 'Migration1682143033241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" RENAME COLUMN "manuallyDisabled" TO "archived"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" RENAME COLUMN "archived" TO "manuallyDisabled"`);
    }

}
