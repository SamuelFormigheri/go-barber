import { Router } from 'express';

import verifyAuthenticated from '@modules/users/infra/http/middlewares/verifyAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import { celebrate, Joi, Segments } from 'celebrate';

const providersRouter = Router();
const providersController = new ProvidersController();
//Utilizar o middleware para todas rotas de providers
providersRouter.use(verifyAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get('/:provider_id/month-available',celebrate({
    [Segments.PARAMS]:{
        provider_id: Joi.string().uuid().required()
    },
    [Segments.BODY]:{
        month: Joi.number().required(),
        year: Joi.number().required()
    }
}), providersController.monthAvailable);

providersRouter.get('/:provider_id/day-available',celebrate({
    [Segments.PARAMS]:{
        provider_id: Joi.string().uuid().required()
    },
    [Segments.BODY]:{
        month: Joi.number().required(),
        year: Joi.number().required(),
        day: Joi.number().required()
    }
}),  providersController.dayAvailable);

providersRouter.get('/day-appointments-scheduled',celebrate({
    [Segments.BODY]:{
        month: Joi.number().required(),
        year: Joi.number().required(),
        day: Joi.number().required()
    }
}),  providersController.providerDaySchedule);

export default providersRouter;