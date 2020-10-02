import 'reflect-metadata';
import UserCreateService from './UserCreateService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: UserCreateService;

describe('CreateUser', () => {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUser = new UserCreateService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    });

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
        expect(user.email).toBe('samuel.formigheri@hotmail.com');
    });
    it('should"nt be able to create a user with non unique e-mail', async () => {
        await createUser.execute({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        await expect(createUser.execute({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);

    });
});