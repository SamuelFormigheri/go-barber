import React from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';

import CreateAppointment from '../pages/CreateAppointment';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import Login from '../pages/Login';
import Page404 from '../pages/_error/Page404';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import ResetPassword from '../pages/ResetPassword';
import RoutePrivate from './RoutePrivate';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <RoutePrivate path="/" exact component={Dashboard} isPrivate={true}/>
        <RoutePrivate path="/profile" exact component={Profile} isPrivate={true}/>
        <RoutePrivate path="/create-appointment" exact component={CreateAppointment} isPrivate={true}/>

        <RoutePrivate path="/login" exact component={Login}/>
        <RoutePrivate path="/register" exact component={Register}/>
        <RoutePrivate path="/forgot-password" exact component={ForgotPassword}/>
        <RoutePrivate path="/reset-password" exact component={ResetPassword}/>
        <RoutePrivate component={Page404}/>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;