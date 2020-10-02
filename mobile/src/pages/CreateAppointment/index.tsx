import React, {useCallback, useEffect, useState, useMemo} from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Alert } from 'react-native';
import { format } from 'date-fns';

import { Container, Header, BackButton, HeaderTitle, UserAvatar, Content,
  ProvidersList, ProvidersListContainer, ProviderContainer, ProviderAvatar,ProviderName,
  Calendar, CalendarTitle, OpenDatePickerButton, OpenDatePickerButtonText, Schedule,
  ScheduleTitle, Section, SectionTitle, SectionContent, Hour, HourText,
  CreateAppointmentButton, CreateAppointmentButtonText } from './styles';

import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import { IProvider } from '../Dashboard';

interface IRouteParams{
  providerId: string;
}
interface IDayAvailable{
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as IRouteParams;
  const {user} = useAuth();
  const { goBack, navigate } = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);

  const [dayAvailables, setDayAvailables] = useState<IDayAvailable[]>([]);

  useEffect(()=>{
    api.get('providers').then(resp=>{
      setProviders(resp.data);
    }).catch(error=> console.log(error));
  },[]);

  useEffect(()=>{
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

  const navigateBack = useCallback(()=>{
    goBack();
  },[goBack]);

  const handleSelectProvider = useCallback((providerId: string)=>{
    setSelectedProvider(providerId);
  },[]);

  /**Criado apenas para monitorar o valor do showDatePicker, depois de corrigir
   * o bug do calendario pode apagar
   */
  useEffect(() => {
    console.log(showDatePicker);
  },[showDatePicker]);

  const handleToggleDatePicker = useCallback(()=>{
    setShowDatePicker((prevState) => !prevState);
  },[]);

  const handleDateChange = useCallback((event: any, date: Date | undefined)=>{
    date && setSelectedDate(date);

    setShowDatePicker(Platform.OS === 'ios');
  },[]);

  const handleSelectHour = useCallback((hour: number)=>{
    setSelectedHour(hour);
  },[])

  const handleCreateAppointment = useCallback(async ()=>{
    try{
      const year = selectedDate.getFullYear().toString();
      const month = (selectedDate.getMonth() + 1).toString();
      const day = selectedDate.getDate().toString();
      const hour = selectedHour.toString();
      const date = year+'-'+month+'-'+day+' '+hour.padStart(2, '0')+':00';

      const data = new Date(selectedDate);
      data.setHours(selectedHour);
      data.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date: date
      });

      navigate('AppointmentCreated', { date: data.getTime() });
    }
    catch(err){
      Alert.alert('Erro ao criar agendamento', 'Ocorreu um erro ao criar agendamento, favor tente novamente.');
    }
  },[navigate, selectedDate, selectedHour, selectedProvider]);

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
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{uri: user.avatar_url}}/>
      </Header>

      <Content>
        <ProvidersListContainer>
          {providers.length > 0 ? (
            <ProvidersList horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(provider) => provider.id}
            renderItem={({item: provider})=>(
              <ProviderContainer
              onPress={()=> handleSelectProvider(provider.id)}
              selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{uri: provider.avatar_url}}/>
                <ProviderName
                selected={provider.id === selectedProvider}
                >{provider.name}</ProviderName>
              </ProviderContainer>
            )}
            />
          ): (<SectionTitle>Carregando ... </SectionTitle>)}
        </ProvidersListContainer>
        <Calendar>
          <CalendarTitle>Escolha a data</CalendarTitle>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker value={selectedDate}
            mode="date" display="calendar"
            onChange={handleDateChange}
            />
          )}
        </Calendar>

        <Schedule>
          <ScheduleTitle>
            Escolha o Horário
          </ScheduleTitle>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailable.length > 0 ? morningAvailable.map(({hourFormatted, hour, available})=>(
                <Hour onPress={()=>handleSelectHour(hour)} selected={selectedHour === hour} enabled={available}
                available={available} key={hourFormatted}><HourText selected={selectedHour === hour}>{hourFormatted}</HourText></Hour>
              )): (<SectionTitle>Carregando ... </SectionTitle>)}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {eveningAvailable.length > 0 ? eveningAvailable.map(({hourFormatted, hour, available})=>(
                <Hour onPress={()=>handleSelectHour(hour)} selected={selectedHour === hour} enabled={available}
                available={available} key={hourFormatted}><HourText selected={selectedHour === hour}>{hourFormatted}</HourText></Hour>
              )): (<SectionTitle>Carregando ... </SectionTitle>)}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
}

export default CreateAppointment;