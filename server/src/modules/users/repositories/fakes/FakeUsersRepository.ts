import { v4 } from 'uuid';
import User from '@modules/users/infra/typeorm/models/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class FakeUsersRepository implements IUsersRepository{
    private users: User[] = [];

    public async findById(id: string): Promise<User | null> {
        const user = this.users.find(user => user.id === id);

        return user || null;
    }

    public async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(user => user.email === email);

        return user || null;
    }

    public async findAllProviders(except_user_id: string) : Promise<User[]> {
        let{ users } = this;

        if(except_user_id){
            users = this.users.filter(user => user.id !== except_user_id);
        }

        return users;
    }

    public async create(data: ICreateUserDTO) : Promise<User> {
        const user = new User();
        Object.assign(user, { id: v4() }, data);
        this.users.push(user);
        return user;
    }

    public async save(user: User) : Promise<User> {
       const findIndex =  this.users.findIndex(findUser => findUser.id === user.id);
       this.users[findIndex] = user;
       return user;
    }

}

export default FakeUsersRepository;