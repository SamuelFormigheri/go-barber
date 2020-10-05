import React, {useCallback, useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../hooks/AuthContext';

import { Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar, ProvidersList,
  ProviderContainer, ProviderAvatar, ProviderInfo, ProviderName, ProviderMeta, ProviderMetaText, ProvidersListTitle,
  AgendaButton, AgendaText } from './styles';
import api from '../../services/api';

export interface IProvider{
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<IProvider[]>([]);
  const{user} = useAuth();
  const { navigate } = useNavigation();

  useEffect(()=>{
    api.get('providers').then(resp=>{
      setProviders(resp.data);
    });
  },[]);

  const navigateToCreateAppointment = useCallback((providerId: string)=>{
    navigate('CreateAppointment', { providerId });
  },[navigate]);

  const navitateToProfile = useCallback(()=>{
    navigate('Profile');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {"\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navitateToProfile}>
          <UserAvatar source={{uri: user.avatar_url}} />
        </ProfileButton>
      </Header>

      <AgendaButton onPress={()=> navigate('MyAppointments')}>
          <Icon name="calendar" size={20} color="#999591"/>
          <AgendaText> Verificar meus Agendamentos</AgendaText>
      </AgendaButton>

      <ProvidersList data={providers}
      ListHeaderComponent={
        <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
      }
      keyExtractor={(provider) => provider.id}
      renderItem={({item : provider}) => (
        <ProviderContainer onPress={()=> navigateToCreateAppointment(provider.id)}>

          <ProviderAvatar source={{uri: provider.avatar_url}}/>
          <ProviderInfo>
            <ProviderName>{provider.name}</ProviderName>

            <ProviderMeta>
              <Icon name="calendar" size={14} color="#FF9000"/>
              <ProviderMetaText>Segunda à Sexta</ProviderMetaText>
            </ProviderMeta>

            <ProviderMeta>
              <Icon name="clock" size={14} color="#FF9000"/>
              <ProviderMetaText>8h às 18h</ProviderMetaText>
            </ProviderMeta>

          </ProviderInfo>
        </ProviderContainer>
      )}/>
    </Container>
  );
}

export default Dashboard;