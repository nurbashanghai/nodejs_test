import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UsersAddEmail1587312671082 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.addColumn('users', new TableColumn({
            name: 'email',
            type: 'varchar',
            isUnique: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('users', 'email');
    }

}
