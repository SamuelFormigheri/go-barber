import { injectable, inject} from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/models/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}


@injectable()
class ProvidersListAppointmentsService {
    private appointmentsRepository: IAppointmentsRepository;
    private cacheProvider: ICacheProvider;

    constructor(@inject('AppointmentsRepository') appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider') cacheProvider: ICacheProvider){
        this.appointmentsRepository = appointmentsRepository;
        this.cacheProvider = cacheProvider;
    }

    public async execute(obj: IRequest) : Promise<Appointment[]>{
        let appointments = await this.cacheProvider.get<Appointment[]>(`provider-appointments:${obj.provider_id}:${obj.year}-${obj.month}-${obj.day}`);

        if(!appointments){
            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                day: obj.day,
                month: obj.month,
                provider_id: obj.provider_id,
                year: obj.year
            });
            await this.cacheProvider.save(`provider-appointments:${obj.provider_id}:${obj.year}-${obj.month}-${obj.day}`, classToClass(appointments));
        }
        
        
        return appointments;
    }
}

export default ProvidersListAppointmentsService;