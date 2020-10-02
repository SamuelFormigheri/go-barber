import React, {useCallback, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
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

interface IForgotPassword{
   email: string;
}

const ForgotPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const {addToast} = useToast();

    const handleSubmit = useCallback(async (data: IForgotPassword) :Promise<void> => {
        try
        {
          setLoading(true);
          formRef.current?.setErrors({});
  
          const schema = Yup.object().shape({
              email: Yup.string().required('E-mail é Obrigatório.').email('E-mail Invalido.')
          });
  
          await schema.validate(data, {
              abortEarly: false
          });

          await api.post('/password/forgot',{
              email: data.email
          });

          history.push('/login');

          addToast({
            id: "message",
            type: "success",
            title: "E-mail de recuperação enviado",
            description: "Verifique sua caixa de e-mail..." 
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
            title: "Erro na recuperação de senha",
            description: "Ocorreu um erro ao tentar recuperar a senha..."
        }
         addToast(message);
        } finally{
            setLoading(false);
        }
    },[addToast, history]);


  return (
      <Container>
          <Content>
              <AnimationContainer>
              <img src={logo} alt="GoBarber Logo"/>

              <Form ref={formRef} onSubmit={handleSubmit}>
                  <h1>Recuperar Senha</h1>
                  <Input name="email" icon={FiMail} placeholder="E-mail"/>

                  <Button loading={loading} type="submit">Recuperar</Button>
              </Form>
              <Link to="/login"><FiLogIn /> Voltar</Link>
              </AnimationContainer>
          </Content>
          <Background />
      </Container>
  );
}

export default ForgotPassword;