import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterRole1726625488422 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'role',
      new TableColumn({
        name: 'normalize_name',
        type: 'varchar',
        default: null,
        length: '100',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('role', 'normalize_name');
  }
}
