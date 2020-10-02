import {Request, Response} from 'express';
import {container} from 'tsyringe';
import { classToClass } from 'class-transformer';
import UserAuthenticateService from '@modules/users/services/UserAuthenticateService';

export default class SessionsController {
    async create(request: Request, response: Response): Promise<Response>{
        const { email, password } = request.body;

        const authenticateUser = container.resolve(UserAuthenticateService);
    
        const {token, user} = await authenticateUser.execute({
            email: email,
            password: password
        });

        return response.json({token, user: classToClass(user)});
    }
}