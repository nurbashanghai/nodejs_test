import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePosts1587311647430 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'posts',
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
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'users',
                    onDelete: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('posts');
        console.log('tbfk', table.foreignKeys);
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        console.log('fk', foreignKey)
        await queryRunner.dropForeignKey('posts', foreignKey);
        await queryRunner.dropTable('posts');
    }
}
