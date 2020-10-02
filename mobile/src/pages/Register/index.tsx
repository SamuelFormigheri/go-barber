import React,{useCallback, useRef} from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.png';

import { Container, Title, BackToLogin, BackToLoginText } from './styles';

import api from '../../services/api';

interface ISignUp{
  name: string;
  email: string;
  password: string; 
}

const Register: React.FC = () => {
  const navigation = useNavigation();
  const inputEmailRef = useRef<TextInput>(null);
  const inputPasswordRef = useRef<TextInput>(null);
  const inputConfimationPasswordRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);

  const handleRegister = useCallback(async (data: ISignUp) :Promise<void> => {
    try
    {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
          name: Yup.string().required('Nome é Obrigatório.'),
          email: Yup.string().required('E-mail é Obrigatório.').email('E-mail Invalido.'),
          password: Yup.string().min(6, 'Senha deve ter no mínimo 6 digitos.'),
          password_confirmation: Yup.string().oneOf([Yup.ref('password')], 'As senhas não conferem')
      });

      await schema.validate(data, {
          abortEarly: false
      });

      await api.post('/users', data);

      Alert.alert('Sucesso','Cadastro realizado com sucesso...');
      navigation.navigate('Login');
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
},[navigation]);

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex: 1}}>
          <Container>
            <Image source={logoImg}/>
            <Title>Crie sua conta</Title>
            <Form ref={formRef} onSubmit={handleRegister} style={{width: '100%'}}>

              <Input name="name" icon="user" placeholder="Nome" 
              autoCorrect={false} autoCapitalize="words" returnKeyType="next" onSubmitEditing={()=>{inputEmailRef.current?.focus()}}
              />

              <Input ref={inputEmailRef} name="email" icon="mail" placeholder="E-mail" 
              autoCorrect={false} autoCapitalize="none" keyboardType="email-address" returnKeyType="next" onSubmitEditing={()=>{inputPasswordRef.current?.focus()}} 
              />

              <Input ref={inputPasswordRef} name="password" icon="lock" placeholder="Senha" 
              secureTextEntry returnKeyType="next" onSubmitEditing={()=>{inputConfimationPasswordRef.current?.focus()}}/>

              <Input ref={inputConfimationPasswordRef} name="password_confirmation" icon="lock" placeholder="Confirmar Senha" 
              secureTextEntry returnKeyType="send" onSubmitEditing={()=>formRef.current?.submitForm()}/>

              <Button onPress={()=>formRef.current?.submitForm()}> Confirmar </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToLogin onPress={()=> navigation.navigate('Login')}>
        <Icon name="arrow-left" size={20} color="#fff"/>
        <BackToLoginText>Voltar para login</BackToLoginText>
      </BackToLogin>
    </>
  );
}

export default Register;