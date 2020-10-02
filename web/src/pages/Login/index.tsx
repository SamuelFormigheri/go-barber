import React, {useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';


import logo from '../../assets/icons/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {useAuth} from '../../hooks/AuthContext';
import {useToast} from '../../hooks/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Background, AnimationContainer } from './styles';

interface ISignIn{
   email: string;
   password: string; 
}

const Login: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const history = useHistory();
    const {signIn} = useAuth();
    const {addToast} = useToast();

    const handleSubmit = useCallback(async (data: ISignIn) :Promise<void> => {
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
          history.push('/');

          addToast({
            id: "message",
            type: "success",
            title: "Logado com Sucesso",
            description: "Seja bem vindo ao Go Barber..." 
        })
        }
        catch(err)
        {
         if(err instanceof Yup.ValidationError){
            const errors = getValidationErrors(err);
            formRef.current?.setErrors(errors);

            return;
         }
         const message = {
            id: "message",
            type: "danger",
            title: "Erro na autenticação",
            description: "Verifique os campos e tente novamente..."
        }
         addToast(message);
        }
    },[signIn, addToast, history]);


  return (
      <Container>
          <Content>
              <AnimationContainer>
              <img src={logo} alt="GoBarber Logo"/>

              <Form ref={formRef} onSubmit={handleSubmit}>
                  <h1>Faça seu logon</h1>
                  <Input name="email" icon={FiMail} placeholder="E-mail"/>
                  <Input name="password" icon={FiLock} placeholder="Senha" type="password"/>
                  
                  <Button type="submit">Entrar</Button>

                  <Link to="/forgot-password">Esqueci minha senha</Link>
              </Form>
              <Link to="/register"><FiLogIn /> Criar conta</Link>
              </AnimationContainer>
          </Content>
          <Background />
      </Container>
  );
}

export default Login;