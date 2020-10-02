import { injectable, inject} from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type IResponse =  Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ProvidersListDayAvailableService {
    private appointmentsRepository: IAppointmentsRepository;

    constructor(@inject('AppointmentsRepository') appointmentsRepository: IAppointmentsRepository){
        this.appointmentsRepository = appointmentsRepository;
    }

    public async execute(obj: IRequest) : Promise<IResponse>{
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id: obj.provider_id,
            month: obj.month,
            year: obj.year,
            day: obj.day
        });

        const eachHourArray = Array.from({ length: 10}, (value,index)=> index + 8)

        const available = eachHourArray.map(hour =>{
            const appointmentsInHour = appointments.find(appointment=> getHours(appointment.date) === hour);
            
            const currentDate = new Date(Date.now());
            const appointmentDate = new Date(obj.year, obj.month - 1, obj.day, hour);
            
            return{
                hour: hour,
                available: !appointmentsInHour && isAfter(appointmentDate, currentDate)
            };
        });


        return available;
    }
}

export default ProvidersListDayAvailableService;