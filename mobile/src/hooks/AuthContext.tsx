import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

interface IUser{
    id: string;
    name: string;
    email: string;
    avatar_url: string;
}

interface ICredentialsData{
    token: string;
    user: IUser;
}

interface ICredentials {
    email: string;
    password: string;   
}

interface IAuthContext {
    user: IUser;
    signIn(credentials:ICredentials): Promise<void>;
    signOut(): void;
    updateUser(user: IUser): Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);


export const AuthProvider: React.FC = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [credentialsData, setCredentialsData] = useState<ICredentialsData>({} as ICredentialsData);

  useEffect(()=>{
    async function loadStoragedData():Promise<void>{
        const [token, user] = await AsyncStorage.multiGet(['@GoBarber:token','@GoBarber:user']);
    
        if(token[1] && user[1]){
            api.defaults.headers.authorization = `Bearer ${token[1]}`;
            setCredentialsData({token: token[1], user: JSON.parse(user[1])});
        }
        setLoading(false);
      }

      loadStoragedData();
  },[credentialsData])

  const signIn = useCallback(async({email, password}) => {
      const response = await api.post('sessions',{
          email: email,
          password: password
      });
      const { token, user } = response.data;

      await AsyncStorage.setItem('@GoBarber:token', token);
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
      
      api.defaults.headers.authorization = `Bearer ${token}`;

      setCredentialsData({token: token, user: user});
  },[]);

  const signOut = useCallback(async () => {
    
    await AsyncStorage.multiRemove(['@GoBarber:token','@GoBarber:user']);

    setCredentialsData({} as ICredentialsData);
  },[]);

  const updateUser = useCallback(async (updateData: IUser) => {
    setCredentialsData({ token: credentialsData.token, user: updateData});
    await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(updateData));
  },[credentialsData.token]);

  return (
    <AuthContext.Provider value={{user: credentialsData.user, signIn, signOut, updateUser, loading}}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
    const context = useContext(AuthContext);

    if (!context){
        throw new Error('useAuth must be used within an Auth Provider');
    }

    return context;
}
