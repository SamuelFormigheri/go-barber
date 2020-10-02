import React, {useCallback, useRef} from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.png';
// import api from '../../services/api';
import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccount, CreateAccountText } from './styles';
import {useAuth} from '../../hooks/AuthContext';

interface ISignIn{
  email: string;
  password: string; 
}

const Login: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const {signIn, user} = useAuth();
  const handleLogin = useCallback(async (data: ISignIn) :Promise<void> => {
    try
    {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
          email: Yup.string().required('E-mail é Obrigatório.').email('E-mail Invalido.'),
          password: Yup.string().required('Senha é Obrigatório.')
      });

      await schema.validate(data, {
          abortEarly: false
      });

      await signIn({
          email: data.email,
          password: data.password
      });

      Alert.alert('Logado com Sucesso', 'Seja bem vindo ao Go Barber.');
    }
    catch(err)
    {
     if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);

        return;
     }
      Alert.alert('Erro na autenticação', 'Verifique os campos e tente novamente...')
    }
},[signIn]);
  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex: 1}}>
          <Container>
            <Image source={logoImg}/>

            <Title>Faça seu logon</Title>
            <Form ref={formRef} onSubmit={handleLogin} style={{width: '100%'}}>

              <Input name="email" icon="mail" placeholder="E-mail" 
              autoCorrect={false} autoCapitalize="none" keyboardType="email-address"
              returnKeyType="next" onSubmitEditing={()=>formRef.current?.submitForm()}
              />

              <Input ref={passwordInputRef} name="password" icon="lock" placeholder="Senha" 
              secureTextEntry returnKeyType="send" onSubmitEditing={()=>formRef.current?.submitForm()}/>

              <Button onPress={()=>formRef.current?.submitForm()}> Entrar </Button>
            </Form>

            <ForgotPassword onPress={()=>{}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>

        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccount onPress={() => navigation.navigate('Register')}>
        <Icon name="log-in" size={20} color="#ff9000"/>
        <CreateAccountText>Criar uma conta</CreateAccountText>
      </CreateAccount>
    </>
  );
}

export default Login;