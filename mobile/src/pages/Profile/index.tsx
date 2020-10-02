import React,{useCallback, useRef} from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/AuthContext';

import { Container, Title, BackButton, UserAvatarButton, UserAvatar, LogoutButton } from './styles';

import api from '../../services/api';

interface IProfile{
  name: string;
  email: string;
  password: string; 
  old_password: string;
  password_confirmation:string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const inputNameRef = useRef<TextInput>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const inputOldPasswordRef = useRef<TextInput>(null);
  const inputPasswordRef = useRef<TextInput>(null);
  const inputConfirmationPasswordRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);
  const {user, updateUser, signOut} = useAuth();

  const handleUpdateProfile = useCallback(async (data: IProfile) :Promise<void> => {
    try
    {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é Obrigatório.'),
        email: Yup.string().required('E-mail é Obrigatório.').email('E-mail Invalido.'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password',{
            is: val => !!val.length,
            then: Yup.string().required(),
            otherwise: Yup.string
        }),
        password_confirmation: Yup.string().when('old_password',{
            is: val => !!val.length,
            then: Yup.string().required(),
            otherwise: Yup.string
        }).oneOf([Yup.ref('password')], 'As senhas não conferem')
      });

      await schema.validate(data, {
          abortEarly: false
      });

      const formData = Object.assign({
        name: data.name,
        email: data.email
    }, data.old_password ? {
        old_password: data.old_password,
        password: data.password,
        password_confirmation: data.password_confirmation
    }: {});

      const response = await api.put('profile', formData);

      updateUser(response.data);

      Alert.alert('Sucesso','Perfil atualizado com sucesso...');
      navigation.navigate('Dashboard');
    }
    catch(err)
    {
      if(err instanceof Yup.ValidationError){
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
      }
      Alert.alert('Erro','Verifique os campos e tente novamente...');     
    }
},[navigation, updateUser]);

  const handleUpdateAvatar = useCallback(()=>{
    ImagePicker.showImagePicker({
      title:'Selecione um Avatar',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar Câmera',
      chooseFromLibraryButtonTitle: 'Escolher da Galeria'
    },
      response => {
        if (response.didCancel) 
          return;
        if (response.error) {
          Alert.alert('Erro', 'Erro ao atualizar avatar...'); 
          return;
        } 
        const data = new FormData();
        data.append('avatar',{
          type: 'image/jpg',
          name: `${user.id}-profilepic.jpg`,
          uri: response.uri
        });

        api.patch('users/avatar', data).then((resp)=>{
          updateUser(resp.data);
        }).catch(error => console.log(error));
      });
  },[updateUser, user.id]);

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView>
          <Container>
            <BackButton onPress={()=> navigation.navigate('Dashboard')}>
              <Icon name="arrow-left" size={20} color="#999591"/>
            </BackButton>
            <LogoutButton onPress={signOut}>
              <Icon name="log-out" size={20} color="#999591"/>
            </LogoutButton>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar  source={{uri: user.avatar_url}}/>
            </UserAvatarButton>

            <Title>Meu Perfil</Title>
            <Form initialData={{ name: user.name, email: user.email }} ref={formRef} onSubmit={handleUpdateProfile} style={{width: '100%'}}>

              <Input ref={inputNameRef} name="name" icon="user" placeholder="Nome" 
              autoCorrect={false} autoCapitalize="words" returnKeyType="next" onSubmitEditing={()=>{inputEmailRef.current?.focus()}}
              />

              <Input ref={inputEmailRef}  name="email" icon="mail" placeholder="E-mail" 
              autoCorrect={false} autoCapitalize="none" keyboardType="email-address" returnKeyType="next" onSubmitEditing={()=>{inputOldPasswordRef.current?.focus()}} 
              />

              <Input ref={inputOldPasswordRef} name="old_password" icon="lock" placeholder="Senha Atual" 
              secureTextEntry returnKeyType="next" 
               containerStyle={{marginTop: 16}} onSubmitEditing={()=>{inputPasswordRef.current?.focus()}}/>

              <Input ref={inputPasswordRef} name="password" icon="lock" placeholder="Nova Senha" 
              secureTextEntry returnKeyType="next" onSubmitEditing={()=>{inputConfirmationPasswordRef.current?.focus()}}/>

              <Input ref={inputConfirmationPasswordRef} name="password_confirmation" icon="lock" placeholder="Confirmar nova Senha" 
              secureTextEntry returnKeyType="send" onSubmitEditing={()=>formRef.current?.submitForm()}/>

              <Button onPress={()=>formRef.current?.submitForm()}> Confirmar mudanças </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default Profile;