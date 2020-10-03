import Appointment from '../models/Appointment';
import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository{
    private ormRepository: Repository<Appointment>;

    constructor(){
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | null> {
        const findAppointmentInSameDate = await this.ormRepository.findOne({
            where: { date: date, provider_id: provider_id }
        });

        return findAppointmentInSameDate || null;
    }

    public async findAllInMonthFromProvider(obj: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>{
        const parsedMonth = String(obj.month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where:{
                provider_id: obj.provider_id,
                date: Raw(dateFieldName => 
                `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${obj.year}'`)
            }
        })

        return appointments;
    }

    public async findAllInDayFromProvider(obj: IFindAllInDayFromProviderDTO): Promise<Appointment[]>{
        const parsedMonth = String(obj.month).padStart(2, '0');
        const parsedDay = String(obj.day).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where:[{
                provider_id: obj.provider_id,
                date: Raw(dateFieldName => 
                `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${obj.year}'`)
            },
            {
                user_id: obj.provider_id,
                date: Raw(dateFieldName => 
                `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${obj.year}'`) 
            }],
            relations: ['user', 'provider']
        });

        return appointments;
    }

    public async findAll(): Promise<Appointment[]>{
        const findAppointments = await this.ormRepository.find();

        return findAppointments; 
    }

    public async create(data: ICreateAppointmentDTO) : Promise<Appointment> {
       const appointment = this.ormRepository.create(data);
     
       await this.ormRepository.save(appointment);

       return appointment;
    }

}

export default AppointmentsRepository;