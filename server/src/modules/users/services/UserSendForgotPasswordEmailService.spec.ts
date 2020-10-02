import 'reflect-metadata';
import UserSendForgotPasswordEmailService from './UserSendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';


let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let recoverEmail: UserSendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        recoverEmail = new UserSendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokenRepository);
    })

    it('should be able to recover password using email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password:'123456'
        });

        await recoverEmail.execute({
            email: 'johndoe@example.com'
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should"nt be able to recover a non existant email', async () => {
        await expect(recoverEmail.execute({
            email: 'johndoe@example.com'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password:'123456'
        });

        await recoverEmail.execute({
            email: 'johndoe@example.com'
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });

});