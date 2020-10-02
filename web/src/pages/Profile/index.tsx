import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Logo from '../../assets/icons/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/ToastContext';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/AuthContext';

import { Container, Content, AvatarInput } from './styles';

interface IProfile{
    name: string;
    email: string;
    old_password?: string;
    password?: string;
    password_confirmation?: string;

}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const {user, updateUser} = useAuth();
  const {addToast} = useToast();

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files){
        const data = new FormData();
        data.append('avatar', e.target.files[0])
        api.patch('/users/avatar', data).then(resp =>{
            updateUser(resp.data);
            addToast({
                id: "message",
                type: "success",
                title: "Sucesso",
                description: "Avatar atualizado..." 
            })
        });
    }
  },[addToast, updateUser]) 

  const handleSubmit = useCallback(async (data: IProfile) :Promise<void> => {
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

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/');

        addToast({
            id: "message",
            type: "success",
            title: "Sucesso",
            description: "Perfil atualizado com sucesso..." 
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
            title: "Erro na atualização do perfil",
            description: "Verifique os campos e tente novamente..."
        }
         addToast(message);
      }
  },[addToast, history, updateUser]);

  return (
      <Container>
          <header>
              <div>
                <Link to="/">
                    <FiArrowLeft />
                </Link>
              </div>
          </header>
          <Content>
                <Form ref={formRef} initialData={{
                   name: user.name,
                   email: user.email 
                }} onSubmit={handleSubmit}>
                    <AvatarInput>
                        <img src={user.avatar_url ? user.avatar_url : Logo} alt={user.name}></img>
                        <label htmlFor="avatar"><FiCamera />
                            <input type="file" id="avatar" onChange={handleAvatarChange} />
                        </label>
                        
                    </AvatarInput>
                    <h1>Meu Perfil</h1>
                    <Input name="name" icon={FiUser} placeholder="Nome"/>
                    <Input name="email" icon={FiMail} placeholder="E-mail"/>
                    <Input containerstyle={{marginTop: 26}} name="old_password" icon={FiLock} placeholder="Senha atual" type="password"/>
                    <Input name="password" icon={FiLock} placeholder="Nova senha" type="password"/>
                    <Input name="password_confirmation" icon={FiLock} placeholder="Confirmar nova senha" type="password"/>
                    <Button type="submit">Confirmar Mudanças</Button>
                </Form>
          </Content>
      </Container>
  );
}

export default Profile;