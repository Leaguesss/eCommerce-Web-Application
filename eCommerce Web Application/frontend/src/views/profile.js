import React, { useContext,useEffect, useState } from 'react';
// import {Cotainer,AppBar,Typography,Grow,Grid} from '@material-ul/core';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/profile/Navbar';
import ProfilePage from './components/profile/ProfilePage';
import ChangePasswordPage from './components/profile/ChangePasswordPage';
import ManageListingPage from './components/profile/ManageListingPage';
import UserListingPage from './components/profile/UserListingPage';
import AuthContext from "./context/AuthContext";

// import Logout from './components/Logout';





function Profile() {

  const { logState, userId } = useContext(AuthContext);
  const [loggedIn, getLoggedIn] = logState;
  const [user, setUser] = userId;

  
  
  
  return (
    <Router>
      <div className="row" style={{ height: "100vh" }}>
        <div className="col-sm-3">
          <Navbar loggedIn={loggedIn}/>
        </div>
        <div className="col-sm-9">
          {loggedIn ?
            <Switch>
              <Route  path='/profile/ownprofile' >
                <ProfilePage userID={user}  />
              </Route>
              <Route  path='/profile/changepassword'  >
                <ChangePasswordPage userID={user}/>
              </Route>
              <Route  path='/profile/managelisting' >
                <ManageListingPage userID={user} />
              </Route>

              <Route  path='/profile/userlisting' >
                <UserListingPage userID={user} />
              </Route>

              <Redirect from="/profile" to="/profile/ownprofile" />
            </Switch>
            :
            <div className="card text-danger my-3" style={{ width: '60%' }}>
              <div className="card-body">
                <div className="fs-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                  </svg>
                  {' '}
                  <span>No Account Logged In</span>
                </div>
                <h6 className="card-subtitle mb-2 text-danger">Error</h6>
                <p className="card-text">
                  <i>You need to log in first! Click <strong>'PhoneZone'</strong> on the left side to go back to home page.</i>
                </p>
              </div>
            </div>
          }

        </div>
      </div>
    </Router>
  );
};

export default Profile;