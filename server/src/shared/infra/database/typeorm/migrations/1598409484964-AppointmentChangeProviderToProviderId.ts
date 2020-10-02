import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export default class AppointmentChangeProviderToProviderId1598409484964 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('db_appointments', 'provider');
        await queryRunner.addColumn('db_appointments', new TableColumn({
            name: 'provider_id',
            type: 'uuid',
            isNullable: true
        }));
        await queryRunner.createForeignKey('db_appointments', new TableForeignKey({
            name: 'AppointmentProvider',
            columnNames: ['provider_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'db_users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('db_appointments', 'AppointmentProvider');

        await queryRunner.dropColumn('db_appointments', 'provider_id');

        await queryRunner.addColumn('db_appointments', new TableColumn({
            name: 'provider',
            type: 'varchar',
            isNullable: false
        }));
    }

}
