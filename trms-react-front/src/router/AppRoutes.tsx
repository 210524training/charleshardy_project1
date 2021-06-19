import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import HomePage from '../components/pages/home/HomePage';
import LoginPage from '../components/pages/login/LoginPage';

const AppRoutes: React.FC<unknown> = (props) => {

    return (
      <Switch>
        <Route exact path='/'>
            <HomePage />
        </Route>
        <Route exact path='/login'>
          <LoginPage />
        </Route>
        <Route path='/'>
            <Redirect to='/' />
        </Route>
      </Switch>
    );
  };
  
  export default AppRoutes;