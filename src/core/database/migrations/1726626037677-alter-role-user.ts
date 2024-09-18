import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterRoleUser1726626037677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKeys('user_role', [
      new TableForeignKey({
        name: 'user_role_role_id_fkey',
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys('user_role', [
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedTableName: 'role',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        referencedColumnNames: ['id'],
        columnNames: ['user_id'],
        referencedTableName: 'user',
      }),
    ]);
  }
}
