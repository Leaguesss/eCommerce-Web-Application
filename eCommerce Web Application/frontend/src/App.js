import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Account from "./views/account"
import Home from "./views/home"
import CheckOut from "./views/checkOut"
import Profile from "./views/profile"


import { AuthContextProvider } from "./views/context/AuthContext";
//import './App.css';

axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route path='/main' component={Home} />

          <Route path='/auth' component={Account} />

          <Route path='/checkOut' component={CheckOut} />

          <Route path='/profile' component={Profile} >
          
          </Route>
          
        </Switch>

      </Router>
      
    </AuthContextProvider>
  );
}

export default App;
