import 'reflect-metadata';
import ProvidersListMonthAvailableService from './ProvidersListMonthAvailableService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersMonth: ProvidersListMonthAvailableService;

describe('ListProviderMonthAvailable', () => {
    beforeEach(()=>{
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProvidersMonth = new ProvidersListMonthAvailableService(fakeAppointmentsRepository);
    });

    it('should be able to list the providers', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 8, 0, 0 ),
            user_id: 'aa'
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 21, 8, 0, 0 ),
            user_id: 'aa'
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 21, 10, 0, 0 ),
            user_id: 'aa'
        });

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 19, 11).getTime();
        });

        const listAvailable = await listProvidersMonth.execute({provider_id: 'user', month: 5, year: 2020});

        expect(listAvailable).toEqual(expect.arrayContaining([
            {day: 18, available: false},
            {day: 19, available: true},
            {day: 20, available: true},
            {day: 21, available: true},
            {day: 22, available: true}
        ]));    
    });
});