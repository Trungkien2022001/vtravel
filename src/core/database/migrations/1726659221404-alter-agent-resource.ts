import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterAgentResource1726659221404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKeys('agent_resource', [
      new TableForeignKey({
        name: 'agent_resource_resource_id_fkey',
        columnNames: ['resource_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'resource',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['agent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'agent',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys('agent_resource', [
      new TableForeignKey({
        columnNames: ['resource_id'],
        referencedTableName: 'resource',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        referencedColumnNames: ['id'],
        columnNames: ['agent_id'],
        referencedTableName: 'agent',
      }),
    ]);
  }
}
