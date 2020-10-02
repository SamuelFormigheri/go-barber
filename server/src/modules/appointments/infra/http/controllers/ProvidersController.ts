import {Request, Response} from 'express';
import {container} from 'tsyringe';

import ProvidersListService from '@modules/appointments/services/ProvidersListService';
import ProvidersListMonthAvailableService from '@modules/appointments/services/ProvidersListMonthAvailableService';
import ProvidersListDayAvailableService from '@modules/appointments/services/ProvidersListDayAvailableService';
import ProvidersListAppointmentsService from '@modules/appointments/services/ProvidersListAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProvidersController{
    public async index(request: Request, response: Response): Promise<Response>{
        const user_id = request.user.id;
        const listProviders = container.resolve(ProvidersListService);
        const providers = await listProviders.execute({user_id: user_id});
        return response.json(classToClass(providers));
    }

    public async monthAvailable(request: Request, response: Response): Promise<Response>{
        const provider_id = request.params.provider_id;
        const {month, year} = request.query; 
        const listProviderMonthAvailable = container.resolve(ProvidersListMonthAvailableService);
        const available = await listProviderMonthAvailable.execute({month: Number(month), provider_id: provider_id, year: Number(year)});
        return response.json(available);
    }

    public async dayAvailable(request: Request, response: Response): Promise<Response>{
        const provider_id = request.params.provider_id;
        const {month, year, day} = request.query; 
        const listProviderDayAvailable = container.resolve(ProvidersListDayAvailableService);
        const available = await listProviderDayAvailable.execute({month: Number(month), provider_id: provider_id, year: Number(year), day: Number(day)});
        return response.json(available);
    }

    public async providerDaySchedule(request: Request, response: Response): Promise<Response>{
        const provider_id = request.user.id;
        const {month, year, day} = request.query; 
        const listProviderDaySchedule = container.resolve(ProvidersListAppointmentsService);
        const available = await listProviderDaySchedule.execute({month: Number(month), provider_id: provider_id, year: Number(year), day: Number(day)});
        return response.json(classToClass(available));
    }
}