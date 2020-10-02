import { injectable, inject } from 'tsyringe';
import Appointment from '../infra/typeorm/models/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

@injectable()
class AppointmentListService {
    private appointmentsRepository: IAppointmentsRepository;

    constructor(@inject('AppointmentsRepository') appointmentsRepository: IAppointmentsRepository){ 
        this.appointmentsRepository = appointmentsRepository;
    }

    public async execute(): Promise<Appointment[]>{             
        const appointments = await this.appointmentsRepository.findAll();
        return appointments;
    }
}

export default AppointmentListService;