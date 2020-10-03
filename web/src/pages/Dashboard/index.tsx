import React,{ useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, isAfter, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import {FiPower, FiClock, FiUser} from 'react-icons/fi';
import {GoCalendar} from 'react-icons/go';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import {useAuth} from '../../hooks/AuthContext';
import Logo from '../../assets/icons/logo.svg';

import api from '../../services/api';

import { Container, Header, HeaderContent, Profile, Content, Schedule, 
  Calendar, NextAppointment, Section, Appointment, NavigationContainer} from './styles';
import { Link } from 'react-router-dom';

interface IMonthAvailableItem {
  day: number;
  available: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
  }
  provider: {
    id: string;
    name: string;
    avatar_url: string; 
  }
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailable, setMonthAvailable] = useState<IMonthAvailableItem[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const {signOut, user} = useAuth();

  useEffect(()=>{
    api.get(`/providers/${user.id}/month-available`,{
      params:{
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1
      }
    }).then(resp =>{
      setMonthAvailable(resp.data);
    })
  },[currentMonth, user.id]);
  
  useEffect(()=>{
    api.get<IAppointment[]>('/providers/day-appointments-scheduled',{
      params:{
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(resp=>{
      const appointmentsFormatted = resp.data.map(appointment => {
        return{
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm')
        }
      });
      setAppointments(appointmentsFormatted);
    });
  },[selectedDate]);
  
  const handleDayChange = useCallback((day: Date, modifiers: DayModifiers)=>{
    if(modifiers.available && !modifiers.disabled){
      setSelectedDate(day)
    }
  },[]);

  const handleMonthChange = useCallback((month: Date)=>{
    setCurrentMonth(month);
  },[]);

  const disabledDays = useMemo(()=>{
    const dates = monthAvailable.filter(monthDay => monthDay.available === false)
    .map(monthDay => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      return new Date(year, month, monthDay.day);
    });

    return dates;
  },[currentMonth, monthAvailable]);

  const selectedDateAsText = useMemo(()=>{
    return format(selectedDate, "'Dia' dd 'de' MMMM",{
      locale: ptBR
    });
  },[selectedDate]);

  const selectedWeekDayAsText = useMemo(()=>{
    return format(selectedDate, 'cccc',{
      locale: ptBR
    });
  },[selectedDate]);

  const morningAppointments = useMemo(()=>{
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    })
  },[appointments]);

  const eveningAppointments = useMemo(()=>{
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    })
  },[appointments]);

  const nextAppointment = useMemo(()=>{
    return appointments.find(appointment => isAfter(parseISO(appointment.date), new Date()));
  },[appointments]);

  return (
  <Container>
    <Header>
      <HeaderContent>
        <img src={Logo} alt="GoBarber"/>
        <Profile>
          <img src={user.avatar_url ? user.avatar_url : Logo} alt={user.name}/>
          <div>
            <span>Bem-vindo,</span>
            <Link to="/profile"><strong>{user.name}</strong></Link>
          </div>
        </Profile>
        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
    </Header>
    <NavigationContainer>
      <Link to="/create-appointment"> Criar novo Agendamento <GoCalendar /> </Link>
    </NavigationContainer>
    <Content>
      <Schedule>
        <h1>Horários agendados</h1>
        <p>
          {isToday(selectedDate) && <span>Hoje</span>}
          <span>{selectedDateAsText}</span>
          <span>{selectedWeekDayAsText.charAt(0).toUpperCase() + selectedWeekDayAsText.slice(1)}</span>
        </p>
        {isToday(selectedDate) && nextAppointment && (
          <NextAppointment userEqualsUser={nextAppointment.user.id === user.id}>
            <strong>Agendamento a seguir</strong>
            <div>
              {nextAppointment.user.id !== user.id ? (nextAppointment.user.avatar_url ? 
                <img src={nextAppointment.user.avatar_url} alt={nextAppointment.user.name}/> :
                <FiUser />
              ) : (nextAppointment.provider.avatar_url ? 
                <img src={nextAppointment.provider.avatar_url} alt={nextAppointment.provider.name}/> :
                <FiUser />
              )
              }          
              <strong>{nextAppointment.user.id !== user.id ? `${nextAppointment.user.name} agendou com você.` : `Você agendou com ${nextAppointment.provider.name}.` }</strong>
              <span>
                <FiClock />
                {nextAppointment.hourFormatted}
              </span>
            </div>
          </NextAppointment>
        )}

        <Section>
          <strong>Manhã</strong>
          {morningAppointments.length > 0 ? morningAppointments.map(appointment =>{
            return(
            <Appointment key={appointment.id} userEqualsUser={appointment.user.id === user.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  {appointment.user.id !== user.id ? (appointment.user.avatar_url ? 
                    <img src={appointment.user.avatar_url} alt={appointment.user.name}/> :
                    <FiUser />
                  ) : (appointment.provider.avatar_url ? 
                    <img src={appointment.provider.avatar_url} alt={appointment.provider.name}/> :
                    <FiUser />
                  )
                  }          
                  <strong>{appointment.user.id !== user.id ? `${appointment.user.name} agendou com você.` : `Você agendou com ${appointment.provider.name}.` }</strong>
                </div>
            </Appointment>
            );
          }): <p>Nenhum agendamento para este período</p>}
        </Section>

        <Section>
          <strong>Tarde</strong>
          {eveningAppointments.length > 0 ? eveningAppointments.map(appointment =>{
            return(
            <Appointment key={appointment.id} userEqualsUser={appointment.user.id === user.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  {appointment.user.id !== user.id ? (appointment.user.avatar_url ? 
                    <img src={appointment.user.avatar_url} alt={appointment.user.name}/> :
                    <FiUser />
                  ) : (appointment.provider.avatar_url ? 
                    <img src={appointment.provider.avatar_url} alt={appointment.provider.name}/> :
                    <FiUser />
                  )
                  } 
                  <strong>{appointment.user.id !== user.id ? `${appointment.user.name} agendou com você.` : `Você agendou com ${appointment.provider.name}.` }</strong>
                </div>
            </Appointment>
            );
          }): <p>Nenhum agendamento para este período</p>}
        </Section>

      </Schedule>
      <Calendar>
        <DayPicker weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']} 
        fromMonth={new Date()}
        disabledDays={[{
          daysOfWeek: [0, 6]
        }, ...disabledDays]}
        modifiers={{
          available: {daysOfWeek: [1,2,3,4,5]}
        }}
        onMonthChange={handleMonthChange}
        selectedDays={selectedDate}
        onDayClick={handleDayChange}
        months={['Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro']}
        />
        </Calendar> 
    </Content>
  </Container>);
}

export default Dashboard;