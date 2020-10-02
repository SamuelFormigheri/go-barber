import 'reflect-metadata';
import ProvidersListDayAvailableService from './ProvidersListDayAvailableService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersDay: ProvidersListDayAvailableService;

describe('ListProviderDayAvailable', () => {
    beforeEach(()=>{
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProvidersDay = new ProvidersListDayAvailableService(fakeAppointmentsRepository);
    });

    it('should be able to return the avalable hours in day of a provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 12, 0, 0 ),
            user_id: 'aa'
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 13, 0, 0 ),
            user_id: 'aa'
        });

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020,4,20,11).getTime();
        });

        const listAvailable = await listProvidersDay.execute({provider_id: 'user', month: 5, year: 2020, day: 20});

        expect(listAvailable).toEqual(expect.arrayContaining([
            {hour: 8, available: false},
            {hour: 9, available: false},
            {hour: 10, available: false},
            {hour: 11, available: false},
            {hour: 12, available: false},
            {hour: 13, available: false},
            {hour: 14, available: true},
        ]));    
    });
});