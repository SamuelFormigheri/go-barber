import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import PasswordsController from '../controllers/PasswordsController';

const passwordRouter = Router();
const passwordsController = new PasswordsController();

passwordRouter.post('/forgot',celebrate({
    [Segments.BODY]:{
        email: Joi.string().email().required()
    }
}), passwordsController.forgot);

passwordRouter.post('/reset',celebrate({
    [Segments.BODY]:{
        token: Joi.string().uuid().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.string().required().valid(Joi.ref('password'))
    }
}), passwordsController.reset);

export default passwordRouter;