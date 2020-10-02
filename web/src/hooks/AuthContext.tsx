import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
}

interface ICredentialsData{
    token: string;
    user: User;
}

interface ICredentials {
    email: string;
    password: string;   
}

interface IAuthContext {
    user: User;
    signIn(credentials:ICredentials): Promise<void>;
    signOut(): void;
    updateUser(user: User): void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);


export const AuthProvider: React.FC = ({children}) => {

    const getCredentialsFromLocalStorage = useCallback(()=>{
      const token = localStorage.getItem('@GoBarber:token');
      const user = localStorage.getItem('@GoBarber:user');
  
      if(token && user){
          api.defaults.headers.authorization = `Bearer ${token}`;
          return { token, user:JSON.parse(user)};
       }

      return {} as ICredentialsData;
    },[]);

  const [credentialsData, setCredentialsData] = useState<ICredentialsData>(getCredentialsFromLocalStorage);


  const signIn = useCallback(async({email, password}) => {
      const response = await api.post('sessions',{
          email: email,
          password: password
      });
      const { token, user } = response.data;

      localStorage.setItem('@GoBarber:token', token);
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setCredentialsData({token: token, user: user});
  },[]);

  const signOut = useCallback(() => {
    
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setCredentialsData({} as ICredentialsData);
},[]);

  const updateUser = useCallback((updateData: User) => {
    setCredentialsData({ token: credentialsData.token, user: updateData});
    localStorage.setItem('@GoBarber:user', JSON.stringify(updateData));
  },[credentialsData.token]);

  return (
    <AuthContext.Provider value={{user: credentialsData.user, signIn, signOut, updateUser}}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
    const context = useContext(AuthContext);

    if (!context){
        throw new Error('useAuth must be used within an Auth Provider');
    }

    return context;
}
