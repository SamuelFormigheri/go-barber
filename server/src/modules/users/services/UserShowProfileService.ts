import { injectable, inject} from 'tsyringe';
import User from '../infra/typeorm/models/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    user_id: string;
}

@injectable()
class UserShowProfileService {
    private usersRepository: IUsersRepository;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository){
        this.usersRepository = usersRepository;
    }

    public async execute(obj: IRequest) : Promise<User>{
        const user = await this.usersRepository.findById(obj.user_id);
        if(!user){
            throw new AppError('User not found.', 401);
        }
        return user;
    }
}

export default UserShowProfileService;