import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import LoginForm from './components/account/login.component';
import RegistrationForm from './components/account/signUp.component';

import AlertComponent from './components/account/AlertComponent';

import AuthContext from "./context/AuthContext";

function Account(props) {
  //const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  const { logState } = useContext(AuthContext);
  const [loggedIn, getLoggedIn] = logState;

  const redirectToSignIn = () => {
    props.history.push('/main');
  } 

  return (
    <Router>
      <div className="container py-5">
        <div className="text-primary border bg-white shadow p-3" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '15px',
        }}>
          <h1 style={{color:'#00b7ff'}}>Welcome to PhoneZone!</h1>
        </div>
        
        <div className="container d-flex align-items-center flex-column">
          {!loggedIn &&
            <Switch>
              <>
                <Route path="/auth/register" exact component={RegistrationForm}>
                  <RegistrationForm showError={updateErrorMessage} />
                </Route>
                <Route path='/auth/' exact component={LoginForm}>
                  <LoginForm showError={updateErrorMessage} />
                </Route>
                <Route path='/auth/login' exact component={LoginForm}>
                  <LoginForm showError={updateErrorMessage} />
                </Route>
                <Redirect from="/auth" to="/auth/" exact />
              </>
            </Switch>
          }
          {loggedIn &&
            <div className="inputBox mt-2 fs-5 text-secondary">
              <span><i>There's already an account signed in. Please sign out first! </i></span>
              <span className="loginText" onClick={redirectToSignIn}><i><u>Go Home</u></i></span>
            </div>
          }
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
        </div>
      </div>
    </Router>
  );
}

export default Account;