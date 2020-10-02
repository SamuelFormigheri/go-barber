import 'reflect-metadata';
import AppointmentCreateService from './AppointmentCreateService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCashProvider';

import AppError from '@shared/errors/AppError';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: AppointmentCreateService;

describe('AppointmentCreate', () => {
    beforeEach(()=>{
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new AppointmentCreateService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date,'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: '123123123123',
            user_id: '123123123'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123123123');
    });
    
    it('should"nt be able to create two appointments at the same time', async () => {
        jest.spyOn(Date,'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 14).getTime();
        });
        const date = new Date(2020, 4, 10, 15); 

        await createAppointment.execute({
            date: date,
            provider_id: '123123123123',
            user_id: '123123123'
        });

        jest.spyOn(Date,'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 14).getTime();
        });
        
        await expect(createAppointment.execute({
            date: date,
            provider_id: '123123123123',
            user_id: '123123123'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should"nt be able to create appointments on a past date', async () => {
        jest.spyOn(Date,'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 14).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 11),
            provider_id: '123123123123',
            user_id: '1233123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should"nt be able to create appointments with the same provider and user', async () => {
        jest.spyOn(Date,'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: '123123123123',
            user_id: '123123123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should"nt be able to create appointments out of the range', async () => {
        jest.spyOn(Date,'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 7),
            provider_id: '123123123123',
            user_id: '1231233'
        })).rejects.toBeInstanceOf(AppError);

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 19),
            provider_id: '123123123123',
            user_id: '1231233'
        })).rejects.toBeInstanceOf(AppError);

    });
});