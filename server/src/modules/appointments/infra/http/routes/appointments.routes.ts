import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import verifyAuthenticated from '@modules/users/infra/http/middlewares/verifyAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
//Utilizar o middleware para todas rotas de appointments
appointmentsRouter.use(verifyAuthenticated);

appointmentsRouter.get('/', appointmentsController.index);

appointmentsRouter.post('/',celebrate({
    [Segments.BODY]:{
        provider_id: Joi.string().uuid().required(),
        date: Joi.date().required()
    }
}), appointmentsController.create);

export default appointmentsRouter;