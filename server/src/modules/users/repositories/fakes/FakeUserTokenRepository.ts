import { v4 } from 'uuid';

import UserToken from '@modules/users/infra/typeorm/models/UserToken';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';

class FakeUserTokenRepository implements IUserTokenRepository{
    private userTokens: UserToken[] = [];

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken,{
            id: v4(),
            token: v4(),
            user_id: user_id,
            created_at: new Date()
        });

        this.userTokens.push(userToken);

        return userToken;
    }

    public async findByToken(token: string): Promise<UserToken | null> {
       const userToken = this.userTokens.find(findToken => findToken.token === token);
       
       return userToken || null;
    }


}

export default FakeUserTokenRepository;