import 'reflect-metadata';
import AppointmentListService from './AppointmentListService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('AppointmentCreate', () => {
    it('should be able to list appointments', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const listAppointment = new AppointmentListService(fakeAppointmentsRepository);

        const appointments = await listAppointment.execute();

        expect(appointments).toHaveLength(0);
     
        await fakeAppointmentsRepository.create({
            date: new Date(),
            provider_id: '123123123123',
            user_id: 'aaa'
        });

        const appointments1 = await listAppointment.execute();

        expect(appointments1).toHaveLength(1);
        expect(appointments1[0].provider_id).toBe('123123123123');
    });
});