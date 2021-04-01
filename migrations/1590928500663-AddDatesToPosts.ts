import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddDatesToPosts1590928500663 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('posts', new TableColumn({
            name: 'created_at',
            type: 'timestamp with time zone',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP'
        }));
        await queryRunner.addColumn('posts', new TableColumn({
            name: 'updated_at',
            type: 'timestamp with time zone',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('posts','created_at');
        await queryRunner.dropColumn('posts','updated_at');
    }

}
