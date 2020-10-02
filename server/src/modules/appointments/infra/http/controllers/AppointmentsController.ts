import {Request, Response} from 'express';
import {container} from 'tsyringe';

import AppointmentCreateService from '@modules/appointments/services/AppointmentCreateService';
import AppointmentListService from '@modules/appointments/services/AppointmentListService';

export default class AppointmentsController{
    public async index(request: Request, response: Response): Promise<Response>{
        const listAppointment = container.resolve(AppointmentListService);
        const appointments = await listAppointment.execute();
        return response.json(appointments);
    }
    public async create(request: Request, response: Response): Promise<Response>{
        const user_id = request.user.id;
        const { provider_id, date } = request.body;
    
        const createAppointment = container.resolve(AppointmentCreateService);

        const appointment = await createAppointment.execute({provider_id: provider_id, date: date, user_id: user_id});
        return response.json(appointment);
    }
}