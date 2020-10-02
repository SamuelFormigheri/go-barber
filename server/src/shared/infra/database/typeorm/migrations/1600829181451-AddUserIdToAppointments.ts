import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export default class AddUserIdToAppointments1600829181451 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('db_appointments', new TableColumn({
            name: 'user_id',
            type: 'uuid',
            isNullable: true
        }));
        await queryRunner.createForeignKey('db_appointments', new TableForeignKey({
            name: 'AppointmentUser',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'db_users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('db_appointments', 'AppointmentUser');
        await queryRunner.dropColumn('db_appointments', 'user_id');
    }

}
