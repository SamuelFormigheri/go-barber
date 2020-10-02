import 'reflect-metadata';
import ProvidersListService from './ProvidersListService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ProvidersListService;

describe('ListProviders', () => {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviders = new ProvidersListService(fakeUsersRepository, fakeCacheProvider);
    });

    it('should be able to list the providers', async () => {
        const loggedUser = await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        const user1 = await fakeUsersRepository.create({
            email: 'samuel.formigheri2@hotmail.com',
            name: 'Samuel Formigheri2',
            password: '123456'
        });

        const user2 = await fakeUsersRepository.create({
            email: 'samuel.formigheri3@hotmail.com',
            name: 'Samuel Formigheri3',
            password: '123456'
        });

        const providers = await listProviders.execute({user_id: loggedUser.id});

        expect(providers).toEqual([user1, user2]);    
    });
});