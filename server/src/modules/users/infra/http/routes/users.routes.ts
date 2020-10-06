import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import multer from 'multer';
import uploadConfig from '@config/upload';

import verifyAuthenticated from '../middlewares/verifyAuthenticated';
import UsersController from '../controllers/UsersController';


const usersRouter = Router();
const upload = multer(uploadConfig.config.disk);
const usersController = new UsersController();

usersRouter.post('/',celebrate({
    [Segments.BODY]:{
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.string().required().valid(Joi.ref('password'))
    }
}), usersController.create);

usersRouter.patch('/avatar', verifyAuthenticated, upload.single('avatar'), usersController.updateAvatar);

export default usersRouter;