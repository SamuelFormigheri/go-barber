import {Request, Response} from 'express';
import {container} from 'tsyringe';
import { classToClass } from 'class-transformer';

import UserCreateService from '@modules/users/services/UserCreateService';
import UserUpdateAvatarService from '@modules/users/services/UserUpdateAvatarService';

export default class UsersController {
    async create(request: Request, response: Response): Promise<Response>{
        const { name, email, password } = request.body;

        const createUser = container.resolve(UserCreateService);
    
        const user = await createUser.execute({
            name: name,
            email: email,
            password: password
        });
     
        return response.json(classToClass(user));
    }
    async updateAvatar(request: Request, response: Response): Promise<Response>{
        const updateUserAvatar = container.resolve(UserUpdateAvatarService);

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename
        });
   
        return response.json(classToClass(user));
    }
}