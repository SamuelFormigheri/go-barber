import {isBefore, startOfHour, getHours, format} from 'date-fns';
import { injectable, inject } from 'tsyringe';
import Appointment from '../infra/typeorm/models/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest{
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class AppointmentCreateService {
    private appointmentsRepository: IAppointmentsRepository;

    private notificationsRepository: INotificationsRepository;

    private cacheProvider: ICacheProvider;

    constructor(@inject('AppointmentsRepository') appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository') notificationsRepository: INotificationsRepository,
    @inject('CacheProvider') cacheProvider: ICacheProvider){ 
        this.appointmentsRepository = appointmentsRepository;
        this.notificationsRepository = notificationsRepository;
        this.cacheProvider = cacheProvider;
    }

    public async execute(obj : IRequest): Promise<Appointment>{
        const appointmentDate = startOfHour(obj.date);
        
        if(isBefore(appointmentDate, Date.now())){
            throw new AppError("Can't create an appointment on past date.", 401); 
        }

        if(obj.user_id === obj.provider_id){
            throw new AppError("Can't create an appointment with yourself.", 401);
        }

        if(getHours(appointmentDate)< 8 || getHours(appointmentDate) > 17){
            throw new AppError("Hour out of range.", 401);
        }
        
        const hourReserved = await this.appointmentsRepository.findByDate(appointmentDate, obj.provider_id);

        if(hourReserved){
            throw new AppError("The Hour is Occupied.", 401);
        }
        
        const appointment = await this.appointmentsRepository.create({provider_id: obj.provider_id, date : appointmentDate, user_id: obj.user_id});
        
        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");

        await this.notificationsRepository.create({
            recipient_id: obj.provider_id,
            content: `Novo agendamento para a data ${dateFormatted}`
        });

        await this.cacheProvider.delete(`provider-appointments:${obj.provider_id}:${format(appointmentDate,'yyyy-M-d')}`);

        return appointment;
    }
}

export default AppointmentCreateService;