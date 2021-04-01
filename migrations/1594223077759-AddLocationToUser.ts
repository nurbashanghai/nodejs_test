import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddLocationToUser1594223077759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'latitude',
            type: 'decimal',
            isNullable: true
        }));
        await queryRunner.addColumn('users', new TableColumn({
            name: 'longitude',
            type: 'decimal',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'latitude');
        await queryRunner.dropColumn('users', 'longitude');
    }

}
