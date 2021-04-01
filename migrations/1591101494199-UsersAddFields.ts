import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UsersAddFields1591101494199 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'about',
            type: 'text',
            isNullable: true
        }));
        await queryRunner.addColumn('users', new TableColumn({
            name: 'birthdate',
            type: 'date',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'about');
        await queryRunner.dropColumn('users', 'birthdate');
    }

}
