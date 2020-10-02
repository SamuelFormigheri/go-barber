import 'reflect-metadata';
import UserUpdateProfileService from './UserUpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UserUpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UserUpdateProfileService(fakeUsersRepository,fakeHashProvider);
    });

    it('should be able to update the profile of a user', async () => {
        const user = await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        const updatedUser = await updateProfile.execute({user_id: user.id, name:'Samuel P Formigheri', email: "samuelpformigheri@hotmail.com"});

        expect(updatedUser.name).toBe('Samuel P Formigheri');
        expect(updatedUser.email).toBe('samuelpformigheri@hotmail.com');     
    });

    it('should"nt" able to update the profile of a user with a e-mail allready registered', async () => {
        await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        const user = await fakeUsersRepository.create({
            email: 'samuel@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        await expect(updateProfile.execute({
            user_id: user.id, name:'Samuel P Formigheri', 
            email: "samuel.formigheri@hotmail.com"})
        ).rejects.toBeInstanceOf(AppError); 
    });

    it('should be able to update the password of a user', async () => {
        const user = await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        const updatedUser = await updateProfile.execute({user_id: user.id, name:'Samuel P Formigheri', email: "samuelpformigheri@hotmail.com", password: '123123', old_password: '123456'});

        expect(updatedUser.password).toBe('123123');
    });

    it('should be able to update the profile of a non existant user', async () => {
        expect(updateProfile.execute({user_id: 'user.id', name:'Samuel P Formigheri', email: "samuelpformigheri@hotmail.com", password: '123123', old_password: '123456'})).rejects.toBeInstanceOf(AppError);
    });

    it('should"nt be able to update the password of a user without inform old password', async () => {
        const user = await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        await expect(updateProfile.execute({
            user_id: user.id, name:'Samuel P Formigheri', 
            email: "samuelpformigheri@hotmail.com", 
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should"nt be able to update the password of a user with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        await expect(updateProfile.execute({
            user_id: user.id, name:'Samuel P Formigheri', 
            email: "samuelpformigheri@hotmail.com", 
            password: '123123',
            old_password: '123456789999'
        })).rejects.toBeInstanceOf(AppError);
    });

});