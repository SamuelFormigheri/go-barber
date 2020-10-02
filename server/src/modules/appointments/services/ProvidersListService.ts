import { injectable, inject} from 'tsyringe';
import { classToClass } from 'class-transformer';
import User from '@modules/users/infra/typeorm/models/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    user_id: string;
}

@injectable()
class ProvidersListService {
    private usersRepository: IUsersRepository;
    private cacheProvider: ICacheProvider;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('CacheProvider') cacheProvider: ICacheProvider){
        this.usersRepository = usersRepository;
        this.cacheProvider = cacheProvider;
    }

    public async execute(obj: IRequest) : Promise<User[]>{
        let users = await this.cacheProvider.get<User[]>(`providers-list:${obj.user_id}`);

        if(!users){
            users = await this.usersRepository.findAllProviders(obj.user_id);
        }

        await this.cacheProvider.save(`providers-list:${obj.user_id}`, classToClass(users));

        return users;
    }
}

export default ProvidersListService;