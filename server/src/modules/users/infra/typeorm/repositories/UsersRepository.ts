import User from '../models/User';
import { getRepository, Not, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository{
    private ormRepository: Repository<User>;

    constructor(){
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | null> {
        const findUser = await this.ormRepository.findOne({
            where: { id: id }
        });

        return findUser || null;
    }

    public async findByEmail(email: string): Promise<User | null> {
        const findUser = await this.ormRepository.findOne({
            where: { email: email }
        });
        return findUser || null;
    }

    public async findAllProviders(except_user_id: string) : Promise<User[]> {
        let users: User[];
        if(except_user_id){
            users = await this.ormRepository.find({
                where : {
                    id: Not(except_user_id)
                },
                order:{
                    name: "ASC"
                }
            });
        }
        else{
            users = await this.ormRepository.find()
        }

        return users;
    }

    public async create(data: ICreateUserDTO) : Promise<User> {
       const user = this.ormRepository.create(data);

       await this.ormRepository.save(user);

       return user;
    }

    public async save(user: User) : Promise<User> {
        await this.ormRepository.save(user);
 
        return user;
     }

}

export default UsersRepository;