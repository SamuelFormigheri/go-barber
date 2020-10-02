import React, {useCallback, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';


import logo from '../../assets/icons/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {useToast} from '../../hooks/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import { Container, Content, Background, AnimationContainer } from './styles';

interface IResetPassword{
   password: string; 
   password_confirmation: string; 
}

const ResetPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const history = useHistory();
    const {addToast} = useToast();
    const location = useLocation();

    const handleSubmit = useCallback(async (data: IResetPassword) :Promise<void> => {
        try
        {
          formRef.current?.setErrors({});
  
          const schema = Yup.object().shape({
              password: Yup.string().required('Senha é Obrigatório.'),
              password_confirmation: Yup.string().oneOf([Yup.ref('password')], 'As senhas não conferem')
          });
  
          await schema.validate(data, {
              abortEarly: false
          });

          const token = location.search.replace('?token=','');

          if(!token){
              throw new Error();
          }

          await api.post('/password/reset', {
              password: data.password,
              password_confirmation: data.password_confirmation,
              token: token
          });

          history.push('/login');

          addToast({
            id: "message",
            type: "success",
            title: "Sucesso",
            description: "Senha redefinida com sucesso..." 
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
            title: "Erro",
            description: "Erro ao redefinir senha .."
        }
         addToast(message);
        }
    },[addToast, history, location.search]);


  return (
      <Container>
          <Content>
              <AnimationContainer>
              <img src={logo} alt="GoBarber Logo"/>

              <Form ref={formRef} onSubmit={handleSubmit}>
                  <h1>Redefinir Senha</h1>
                  <Input name="password" icon={FiLock} placeholder="Nova senha" type="password"/>
                  <Input name="password_confirmation" icon={FiLock} placeholder="Confirmar senha" type="password"/>
                  
                  <Button type="submit">Entrar</Button>

              </Form>
              <Link to="/login"><FiLogIn /> Voltar</Link>
              </AnimationContainer>
          </Content>
          <Background />
      </Container>
  );
}

export default ResetPassword;