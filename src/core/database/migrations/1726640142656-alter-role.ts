import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AlterRole1726640142656 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'role',
      new TableUnique({
        columnNames: ['name'],
        name: 'role_name_uniq',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('role', 'role_name_uniq');
  }
}
