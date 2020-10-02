import 'reflect-metadata';
import UserAuthenticateService from './UserAuthenticateService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider ;
let authenticateUser: UserAuthenticateService ;

describe('AuthenticateUser', () => {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        authenticateUser = new UserAuthenticateService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able to authenticate user', async () => {
        await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        const user = await authenticateUser.execute({
            email: 'samuel.formigheri@hotmail.com',
            password:'123456'
        });

        expect(user).toHaveProperty('token');
    }); 

    it('should"nt be able to authenticate with wrong email', async () => {
        await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        await expect(authenticateUser.execute({
            email: 'samuel@hotmail.com',
            password:'123456'
        })).rejects.toBeInstanceOf(AppError);
    }); 

    it('should"nt be able to authenticate with wrong password', async () => {
        await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        await expect(authenticateUser.execute({
            email: 'samuel.formigheri@hotmail.com',
            password:'@123456'
        })).rejects.toBeInstanceOf(AppError);
    });  
});