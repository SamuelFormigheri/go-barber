import { injectable, inject} from 'tsyringe';
import path from 'path';

//import User from '../infra/typeorm/models/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';


interface IRequest {
    email: string;
}
@injectable()
class UserSendForgotPasswordEmailService {
    private usersRepository: IUsersRepository;
    private mailProvider: IMailProvider;
    private userTokenRepository: IUserTokenRepository;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository, @inject('MailProvider') mailProvider : IMailProvider,
    @inject('UserTokenRepository') userTokenRepository : IUserTokenRepository){
        this.usersRepository = usersRepository;
        this.mailProvider = mailProvider;
        this.userTokenRepository = userTokenRepository;
    }

    public async execute(obj : IRequest) : Promise<void>  {
        const user = await this.usersRepository.findByEmail(obj.email);

        if(!user){
            throw new AppError('User does not exists.', 401);
        }

        const {token} = await this.userTokenRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views' ,'forgot_password.hbs');

        await this.mailProvider.sendMail({
            to:{
                name: user.name,
                email: user.email
            },
            subject: '[GoBarber] - Recuperação de Senha',
            templateData:{
                file: forgotPasswordTemplate,
                variables:{
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`
                }
            }
        });
    }
}

export default UserSendForgotPasswordEmailService;