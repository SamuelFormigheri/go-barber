import {Request, Response} from 'express';
import {container} from 'tsyringe';
import {classToClass} from 'class-transformer';

import UserUpdateProfileService from '@modules/users/services/UserUpdateProfileService';
import UserShowProfileService from '@modules/users/services/UserShowProfileService';
export default class ProfileController {
    async show(request: Request, response: Response): Promise<Response>{
        const user_id = request.user.id;
        const showProfile = container.resolve(UserShowProfileService);
        const user = await showProfile.execute({user_id});
              
        return response.json(classToClass(user));
    }
    async update(request: Request, response: Response): Promise<Response>{
        const user_id = request.user.id;
        const { email, password, name, old_password } = request.body;

        const updateProfile = container.resolve(UserUpdateProfileService);
    
        const user = await updateProfile.execute({
            email: email,
            password: password,
            name: name,
            user_id:user_id,
            old_password: old_password
        });

       
        return response.json(classToClass(user));
    }
}