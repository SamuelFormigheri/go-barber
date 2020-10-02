import UserToken from '../infra/typeorm/models/UserToken';

export default interface IUserTokenRepository {
    generate(user_id: string): Promise<UserToken>;
    findByToken(token: string): Promise<UserToken | null>;
}