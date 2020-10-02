import 'reflect-metadata';
import ProvidersListAppointmentsService from './ProvidersListAppointmentsService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCashProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ProvidersListAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
    beforeEach(()=>{
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointments = new ProvidersListAppointmentsService(fakeAppointmentsRepository,fakeCacheProvider);
    });

    it('should be able to return the appointmnets of a provider', async () => {
        const app1 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 12, 0, 0 ),
            user_id: 'aa'
        });

        const app2 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 13, 0, 0 ),
            user_id: 'aa'
        });

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020,4,20,11).getTime();
        });

        const listAppointments = await listProviderAppointments.execute({provider_id: 'user', month: 5, year: 2020, day: 20});

        expect(listAppointments).toEqual([app1,app2]);    
    });
});