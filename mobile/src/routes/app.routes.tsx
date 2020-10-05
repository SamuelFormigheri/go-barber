import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import CreateAppointment from '../pages/CreateAppointment';
import AppointmentCreated from '../pages/AppointmentCreated';
import MyAppointments from '../pages/MyAppointments';

const routesStack = createStackNavigator();

const AppRoutes: React.FC = () => {
  return (
    <routesStack.Navigator screenOptions={{ headerShown: false, cardStyle: {backgroundColor: '#312e38'}}}>
      <routesStack.Screen name="Dashboard" component={Dashboard}/>
      <routesStack.Screen name="MyAppointments" component={MyAppointments}/>
      <routesStack.Screen name="CreateAppointment" component={CreateAppointment}/>
      <routesStack.Screen name="AppointmentCreated" component={AppointmentCreated}/>
      <routesStack.Screen name="Profile" component={Profile}/>
    </routesStack.Navigator>
  );
}

export default AppRoutes;