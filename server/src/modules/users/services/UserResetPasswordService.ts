import { injectable, inject} from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
//import User from '../infra/typeorm/models/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';


interface IRequest {
    token: string;
    password: string;
}
@injectable()
class UserResetPasswordService {
    private usersRepository: IUsersRepository;
    private userTokenRepository: IUserTokenRepository;
    private hashProvider: IHashProvider;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('UserTokenRepository') userTokenRepository : IUserTokenRepository,
    @inject('HashProvider') hashProvider : IHashProvider){
        this.usersRepository = usersRepository;
        this.userTokenRepository = userTokenRepository;
        this.hashProvider = hashProvider;
    }

    public async execute(obj : IRequest) : Promise<void>  {
        const userToken = await this.userTokenRepository.findByToken(obj.token);

        if(!userToken){
            throw new AppError('Token not found.', 401);
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if(!user){
            throw new AppError('User not found.', 401); 
        }

        const tokenCreatedAt = userToken.created_at;
        const compareDate = addHours(tokenCreatedAt, 2);

        if(isAfter(Date.now(), compareDate)){
            throw new AppError('Token expired.', 401); 
        }

        user.password = await this.hashProvider.generateHash(obj.password);

        await this.usersRepository.save(user);
    }
}

export default UserResetPasswordService;