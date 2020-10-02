import { v4 } from 'uuid';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/models/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository{
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | null> {
        const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date));
        
        return findAppointment || null;
    }
    
    public async findAll(): Promise<Appointment[]>{
        return this.appointments;
    }

    public async findAllInMonthFromProvider(obj: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>{
        const appointments = this.appointments.filter(appointment =>
            appointment.provider_id === obj.provider_id &&
            getMonth(appointment.date)+1 === obj.month &&
            getYear(appointment.date) === obj.year);

        return appointments;
    }

    public async findAllInDayFromProvider(obj: IFindAllInDayFromProviderDTO): Promise<Appointment[]>{
        const appointments = this.appointments.filter(appointment =>
            appointment.provider_id === obj.provider_id &&
            getMonth(appointment.date)+1 === obj.month &&
            getYear(appointment.date) === obj.year && getDate(appointment.date) === obj.day);

        return appointments;
    }

    public async create(data: ICreateAppointmentDTO) : Promise<Appointment> {
        const appointment = new Appointment();

        appointment.id = v4();
        appointment.date = data.date;
        appointment.provider_id = data.provider_id;

        this.appointments.push(appointment);

        return appointment;
    }

}

export default FakeAppointmentsRepository;