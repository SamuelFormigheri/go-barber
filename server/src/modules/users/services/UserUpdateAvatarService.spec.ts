import 'reflect-metadata';
import UserUpdateAvatarService from './UserUpdateAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;
let updateAvatar: UserUpdateAvatarService;

describe('UpdateAvatar', () => {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeStorageProvider = new FakeStorageProvider();
        updateAvatar = new UserUpdateAvatarService(fakeUsersRepository,fakeStorageProvider);
    });

    it('should be able to update the avatar of a user', async () => {
        const user = await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        const updatedUser = await updateAvatar.execute({user_id: user.id, avatarFilename: 'testfile'});

        expect(updatedUser).toHaveProperty('id');
        expect(updatedUser.avatar).toBe('testfile');       
    });

    it('should"nt be able to update avatar with invalid user', async () => {
        await expect(updateAvatar.execute({user_id: 'invalid', avatarFilename: 'testfile'})).rejects.toBeInstanceOf(AppError);      
    });

    it('should be able to overwrite the avatar image', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            email: 'samuel.formigheri@hotmail.com',
            name: 'Samuel Formigheri',
            password: '123456'
        });

        await updateAvatar.execute({user_id: user.id, avatarFilename: 'testfile'});
        const overwriteUserAvatar = await updateAvatar.execute({user_id: user.id, avatarFilename: 'testfileifoverwrites'});
        
        expect(deleteFile).toHaveBeenCalledWith('testfile');

        expect(overwriteUserAvatar.avatar).toBe('testfileifoverwrites');    
    });
});