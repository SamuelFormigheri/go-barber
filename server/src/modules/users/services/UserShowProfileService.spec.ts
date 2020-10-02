import 'reflect-metadata';
import UserShowProfileService from './UserShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: UserShowProfileService;

describe('ShowProfile', () => {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        showProfile = new UserShowProfileService(fakeUsersRepository);
    });

    it('should be able to show the profile of a user', async () => {
        const user = await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        const profile = await showProfile.execute({user_id: user.id});

        expect(profile.name).toBe('Samuel Formigheri');
        expect(profile.email).toBe('samuel.formigheri@hotmail.com');     
    });

    it('should"nt be able to show the profile of a non existant user', async () => {
        expect(showProfile.execute({user_id: 'user.id'})).rejects.toBeInstanceOf(AppError);     
    });

});