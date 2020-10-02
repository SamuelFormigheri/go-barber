import React from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';

import RoutePrivate from './RoutePrivate';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Page404 from '../pages/_error/Page404';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <RoutePrivate path="/" exact component={Dashboard} isPrivate={true}/>
        <RoutePrivate path="/profile" exact component={Profile} isPrivate={true}/>
        
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