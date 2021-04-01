import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateComments1589017900651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'comments',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'content',
                    type: 'text',
                },
                {
                    name: 'user_id',
                    type: 'int'
                },
                {
                    name: 'post_id',
                    type: 'int'
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'users',
                    onDelete: 'CASCADE'
                },
                {
                    columnNames: ['post_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'posts',
                    onDelete: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('comments');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        const postForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('post_id') !== -1);
        await queryRunner.dropForeignKey('comments', userForeignKey);
        await queryRunner.dropForeignKey('comments', postForeignKey);
        await queryRunner.dropTable('comments');
    }

}
