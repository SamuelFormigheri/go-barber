import { injectable, inject} from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse =  Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ProvidersListMonthAvailableService {
    private appointmentsRepository: IAppointmentsRepository;

    constructor(@inject('AppointmentsRepository') appointmentsRepository: IAppointmentsRepository){
        this.appointmentsRepository = appointmentsRepository;
    }

    public async execute(obj: IRequest) : Promise<IResponse>{
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id: obj.provider_id,
            month: obj.month,
            year: obj.year
        });

        const numberOfDaysInMonth = getDaysInMonth(new Date(obj.year, obj.month - 1)); 

        const eachDayArray = Array.from({ length: numberOfDaysInMonth},(value,index) => index + 1);

        const available = eachDayArray.map(day =>{
            const currentDate = new Date(obj.year, obj.month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment=>{
                return getDate(appointment.date) === day;
            });
            return{
                day: day,
                available: isAfter(currentDate, Date.now()) && appointmentsInDay.length < 10
            };
        });


        return available;
    }
}

export default ProvidersListMonthAvailableService;