import { injectable, inject} from 'tsyringe';
import User from '../infra/typeorm/models/User';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UserUpdateProfileService {
    private usersRepository: IUsersRepository;
    private hashProvider: IHashProvider;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository, @inject('HashProvider') hashProvider: IHashProvider){
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
    }

    public async execute(obj: IRequest) : Promise<User>{
        const user = await this.usersRepository.findById(obj.user_id);
        if(!user){
            throw new AppError('User not found.', 401);
        }

        const userWithEmail = await this.usersRepository.findByEmail(obj.email);

        if(userWithEmail && userWithEmail.id !== obj.user_id){
            throw new AppError('Email allready used.', 401);
        }

        user.name = obj.name;
        user.email = obj.email;

        if(obj.password && !obj.old_password){
            throw new AppError('Old password not found.', 401);
        }
        if(obj.password && obj.old_password){
            const checkOldPassword = await this.hashProvider.compareHash(obj.old_password, user.password);
            if(!checkOldPassword){
                throw new AppError('Passwords not match.', 401); 
            }
            user.password = await this.hashProvider.generateHash(obj.password);
        }
        return await this.usersRepository.save(user);
    }
}

export default UserUpdateProfileService;