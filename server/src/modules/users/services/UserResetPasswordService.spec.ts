import 'reflect-metadata';
import UserResetPasswordService from './UserResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';


let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: UserResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPassword = new UserResetPasswordService(fakeUsersRepository, fakeUserTokenRepository, fakeHashProvider);
    })

    it('should be able to reset password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password:'123456'
        });

        const {token} = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

        await resetPassword.execute({
            password: '123123',
            token: token
        });

        const findUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(findUser?.password).toBe('123123');
    });

    it('should"nt be able to reset password with non existant token', async () => {
        await expect(resetPassword.execute({
            token: 'fake',
            password: 'fake123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should"nt be able to reset password with non existant user', async () => {
        const {token} = await fakeUserTokenRepository.generate('non-user');

        await expect(resetPassword.execute({
            token: token,
            password: 'fake123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should"nt be able to reset password after 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password:'123456'
        });

        const {token} = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementation(()=>{
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(resetPassword.execute({
            token: token,
            password: 'fake123123'
        })).rejects.toBeInstanceOf(AppError);
    });

});