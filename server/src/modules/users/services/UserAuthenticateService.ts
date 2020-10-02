import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject} from 'tsyringe';

import User from '../infra/typeorm/models/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import auth from '@config/auth';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse{
    user: User;
    token: string;
}

@injectable()
class UserAuthenticateService {
    private usersRepository: IUsersRepository; 
    private hashProvider: IHashProvider;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository, @inject('HashProvider') hashProvider: IHashProvider){
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
    }

    public async execute(obj: IRequest): Promise<IResponse>{
        const user = await this.usersRepository.findByEmail(obj.email);

        if(!user){
            throw new AppError('Email/Password incorrect.', 401);
        }

        const passwordMatched = await this.hashProvider.compareHash(obj.password, user.password);
        
        if(!passwordMatched){
            throw new AppError('Email/Password incorrect.', 401);
        }

        const token = sign({},  authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn
        });

        return {user, token};

    }
}

export default UserAuthenticateService;