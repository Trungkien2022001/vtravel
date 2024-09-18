import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AlterUser1726639986070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'user',
      new TableUnique({
        columnNames: ['username'],
        name: 'user_username_uniq',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('user', 'user_username_uniq');
  }
}
