import React from 'react';
import { Redirect, Route, Switch} from 'react-router-dom';
import HomePage from '../components/pages/home/HomePage';
import LoginPage from '../components/pages/login/LoginPage';
import RegisterPage from '../components/pages/register/registerPage';
import ReimbursementsPage from '../components/pages/reimbursements/reimbursementsPage';
import ReimbursementPage from '../components/pages/reimbursements/reimbursementPage';
import RequestPage from '../components/pages/request/requestPage';
import EvaluationPage from '../components/pages/evaluation/evaluation';
const AppRoutes: React.FC<unknown> = (props) => {

    return (
      <Switch>
        <Route exact path='/'>
            <HomePage />
        </Route>
        <Route exact path='/evaluations/:id'>
            <EvaluationPage />
        </Route>
        <Route exact path='/login'>
          <LoginPage />
        </Route>
        <Route exact path='/request'>
          <RequestPage />
        </Route>
        <Route exact path='/reimbursments'>
          <ReimbursementsPage />
        </Route>
        <Route exact path='/reimbursments/:id'>
          <ReimbursementPage/>
        </Route>
        <Route exact path='/register'>
          <RegisterPage />
        </Route>
        <Route path='/'>
            <Redirect to='/' />
        </Route>
      </Switch>
    );
  };
  
  export default AppRoutes;