import { injectable, inject} from 'tsyringe';
import User from '../infra/typeorm/models/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    name: string;
    email: string;
    password: string;
}
@injectable()
class UserCreateService {
    private usersRepository: IUsersRepository;
    private hashProvider: IHashProvider;
    private cacheProvider: ICacheProvider;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository, 
    @inject('HashProvider') hashProvider: IHashProvider,
    @inject('CacheProvider') cacheProvider: ICacheProvider){
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.cacheProvider = cacheProvider;
    }

    public async execute(obj : IRequest) : Promise<User>  {
        const checkUserExistance = await this.usersRepository.findByEmail(obj.email);

        if (checkUserExistance){
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await this.hashProvider.generateHash(obj.password);

        const user = this.usersRepository.create({
            name: obj.name,
            email: obj.email,
            password: hashedPassword
        });

        await this.cacheProvider.deletePrefix('providers-list');

        return user;
    }
}

export default UserCreateService