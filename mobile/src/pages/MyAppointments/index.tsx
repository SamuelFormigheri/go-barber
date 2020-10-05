import React, {useCallback, useEffect, useState, useMemo} from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Text } from 'react-native';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Container, Header, BackButton, HeaderTitle, UserAvatar, Content,
  Calendar, CalendarTitle, OpenDatePickerButton, OpenDatePickerButtonText, Schedule,
  ScheduleTitle, Section, SectionTitle, ProviderContainer, ProviderAvatar, ProviderInfo,
  ProviderMeta, ProviderMetaText, ProviderName  } from './styles';

import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';

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

const MyAppointments: React.FC = () => {
  const {user} = useAuth();
  const { goBack } = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [appointments, setAppointments] = useState<IAppointment[]>([]);

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

  const handleToggleDatePicker = useCallback(()=>{
    setShowDatePicker((prevState) => !prevState);
  },[]);

  const handleDateChange = useCallback((event: any, date: Date | undefined)=>{
    setShowDatePicker(Platform.OS === 'ios');
    date && setSelectedDate(date);
  },[]);

  const selectedDateAsText = useMemo(()=>{
    return format(selectedDate, "'Dia' dd 'de' MMMM",{
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

  const dateTimePicker = useMemo(() => {
    return (
      showDatePicker && (
        <DateTimePicker value={selectedDate}
        mode="date" display="calendar"
        onChange={handleDateChange}
        />
      )
    );
  }, [showDatePicker, selectedDate, handleDateChange]);

  return (
    <Container>
      <Header>
        <BackButton onPress={goBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Meus Agendamentos</HeaderTitle>
        <UserAvatar source={{uri: user.avatar_url}}/>
      </Header>

      <Content>
        <Calendar>
          <CalendarTitle>Escolha a data</CalendarTitle>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {dateTimePicker}
        </Calendar>

        <Schedule>
          <ScheduleTitle>
            {selectedDateAsText}
          </ScheduleTitle>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            {morningAppointments.length > 0 ? morningAppointments.map(appointment => {
              return(
                <ProviderContainer key={appointment.id} userEqualsUser={appointment.user.id === user.id}>

                  <ProviderAvatar source={{uri: appointment.user.id !== user.id ? appointment.user.avatar_url : appointment.provider.avatar_url}}/>
                  <ProviderInfo>
                  <ProviderName>{appointment.user.id !== user.id ? `${appointment.user.name} agendou com você.` : `Você agendou com ${appointment.provider.name}.` }</ProviderName>
                    <ProviderMeta>
                      <Icon name="clock" size={14} color="#FF9000"/>
                      <ProviderMetaText>{appointment.hourFormatted}</ProviderMetaText>
                    </ProviderMeta>

                  </ProviderInfo>
                </ProviderContainer>
              );
            }): <Text>Nenhum agendamento para este período</Text>}
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            {eveningAppointments.length > 0 ? eveningAppointments.map(appointment => {
              return(
                <ProviderContainer key={appointment.id} userEqualsUser={appointment.user.id === user.id}>

                  <ProviderAvatar source={{uri: appointment.user.id !== user.id ? appointment.user.avatar_url : appointment.provider.avatar_url}}/>
                  <ProviderInfo>
                  <ProviderName>{appointment.user.id !== user.id ? `${appointment.user.name} agendou com você.` : `Você agendou com ${appointment.provider.name}.` }</ProviderName>
                    <ProviderMeta>
                      <Icon name="clock" size={14} color="#FF9000"/>
                      <ProviderMetaText>{appointment.hourFormatted}</ProviderMetaText>
                    </ProviderMeta>

                  </ProviderInfo>
                </ProviderContainer>
              );
            }): <Text>Nenhum agendamento para este período</Text>}
          </Section>
        </Schedule>

      </Content>
    </Container>
  );
}

export default MyAppointments;