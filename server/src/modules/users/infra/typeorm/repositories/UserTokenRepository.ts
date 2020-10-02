import UserToken from '../models/UserToken';
import { getRepository, Repository } from 'typeorm';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';

class UserTokenRepository implements IUserTokenRepository{
    private ormRepository: Repository<UserToken>;

    constructor(){
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | null> {
        const findUser = await this.ormRepository.findOne({
            where: { token: token }
        });

        return findUser || null;
    }

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({
            user_id: user_id
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }
}

export default UserTokenRepository;