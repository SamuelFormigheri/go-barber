import React,{ useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {FiPower, FiUser, FiArrowLeft} from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { isToday, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {useAuth} from '../../hooks/AuthContext';
import {useToast} from '../../hooks/ToastContext';
import Logo from '../../assets/icons/logo.svg';
import Slider from '../../components/Slider';
import SliderItem from '../../components/Slider/SliderItem';
import api from '../../services/api';

import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, 
  Section, ProviderContent, ProviderItem, SectionContent, Hour, ButtonConfirmAppointment,
  ButtonContent} from './styles';

interface IMonthAvailableItem {
  day: number;
  available: boolean;
}

interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

interface IDayAvailable{
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const history = useHistory();
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [dayAvailables, setDayAvailables] = useState<IDayAvailable[]>([]);
  const [monthAvailable, setMonthAvailable] = useState<IMonthAvailableItem[]>([]);

  const {signOut, user} = useAuth();
  const {addToast} = useToast();

  useEffect(()=>{
    api.get(`/providers`).then(resp =>{
      setProviders(resp.data);
    }).catch(error => console.log(error));
  },[])

  useEffect(()=>{
    if(!selectedProvider) return;
    api.get(`/providers/${selectedProvider}/month-available`,{
      params:{
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1
      }
    }).then(resp =>{
      setMonthAvailable(resp.data);
    })
  },[currentMonth, selectedProvider]);
  
  useEffect(()=>{
    if(!selectedProvider) return;
    api.get(`providers/${selectedProvider}/day-available`,{
      params:{
        year:  selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day:   selectedDate.getDate()
      }
    }).then(resp=>{
      setDayAvailables(resp.data);
    }).catch(error => console.log(error));
  },[selectedDate, selectedProvider]);
  
  const handleDayChange = useCallback((day: Date, modifiers: DayModifiers)=>{
    if(modifiers.available && !modifiers.disabled){
      setSelectedDate(day)
    }
  },[]);

  const handleMonthChange = useCallback((month: Date)=>{
    setCurrentMonth(month);
  },[]);

  const handleSelectProvider = useCallback((providerId: string)=>{
    setSelectedProvider(providerId);
  },[]);

  const handleSelectHour = useCallback((hour: number)=>{
    setSelectedHour(hour);
  },[]);

  const handleCreateAppointment = useCallback(async ()=>{
    try{
      const year = selectedDate.getFullYear().toString();
      const month = (selectedDate.getMonth() + 1).toString();
      const day = selectedDate.getDate().toString();
      const hour = selectedHour.toString();
      const date = year+'-'+month+'-'+day+' '+hour.padStart(2, '0')+':00';

      await api.post('appointments', {
        provider_id: selectedProvider,
        date: date
      });

      history.push('/');

      addToast({
          id: "message",
          type: "success",
          title: "Sucesso",
          description: "Agendamento cadastrado com sucesso..." 
      });
    }
    catch(err){
      addToast({
        id: "message",
        type: "danger",
        title: "Erro na autenticação",
        description: "Verifique os campos e tente novamente..."
      });
    }
  },[history, addToast, selectedDate, selectedHour, selectedProvider]);

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

  const morningAvailable = useMemo(()=>{
    return dayAvailables.filter(({hour})=> hour < 12)
    .map(({hour, available})=>{
      return{
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00') 
      }
    });
  },[dayAvailables]);

  const eveningAvailable = useMemo(()=>{
    return dayAvailables.filter(({hour})=> hour >= 12)
    .map(({hour, available})=>{
      return{
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00') 
      }
    });
  },[dayAvailables]);

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
   
    <ProviderContent>
      <Slider>
        {providers.length > 0 && providers.map(provider => {
          return(
          <SliderItem  key={provider.id}>
            <ProviderItem selected={provider.id === selectedProvider} onClick={() => handleSelectProvider(provider.id)}>
              <div>
                {provider.avatar_url ? 
                  <img src={provider.avatar_url} alt={provider.name}/> :
                  <FiUser />
                }     
                <strong>{provider.name}</strong>
              </div>
            </ProviderItem>
          </SliderItem>
          )
        })
        }
      </Slider>
    </ProviderContent>

    <Content>
      <Schedule>
        <h1>Agendar Horário</h1>
        <p>
          {isToday(selectedDate) && <span>Hoje</span>}
          <span>{selectedDateAsText}</span>
          <span>{selectedWeekDayAsText.charAt(0).toUpperCase() + selectedWeekDayAsText.slice(1)}</span>
        </p>

        <Section>
          <strong>Manhã</strong>
          <SectionContent>
              {morningAvailable.length > 0 ? morningAvailable.map(({hourFormatted, hour, available})=>(
                <Hour onClick={()=>handleSelectHour(hour)} selected={selectedHour === hour} disabled={!available}
                available={available} key={hourFormatted}><span>{hourFormatted}</span></Hour>
              )): (<p> Selecione um barbeiro...  </p>)}
            </SectionContent>
        </Section>

        <Section>
          <strong>Tarde</strong>
          <SectionContent>
              {eveningAvailable.length > 0 ? eveningAvailable.map(({hourFormatted, hour, available})=>(
                <Hour onClick={()=>handleSelectHour(hour)} selected={selectedHour === hour} disabled={!available}
                available={available} key={hourFormatted}><span>{hourFormatted}</span></Hour>
              )): (<p> Selecione um barbeiro...  </p>)}
            </SectionContent>
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
    <ButtonContent>
      <Link to="/"> <FiArrowLeft /> Retornar à Dashboard </Link>
      <ButtonConfirmAppointment onClick={handleCreateAppointment}>
              <span>Confirmar Agendamento</span>
      </ButtonConfirmAppointment>
    </ButtonContent>
  </Container>);
}

export default CreateAppointment;