import User from '../infra/typeorm/models/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository{
    create(data: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>; 
    findByEmail(id: string): Promise<User | null>;
    findAllProviders(except_user_id?: string): Promise<User[]>;
}