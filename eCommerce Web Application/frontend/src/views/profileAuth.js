
import React from 'react';
import { Redirect } from 'react-router';


export function profileAuth (Component, loggedIn,userID) {
  
    return class extends React.Component {
  
      renderPage () {
        return (
          <Component userID = {userID} />
        )
      }
  
      render () {
        console.log("profile logged in", loggedIn);
        if (loggedIn) {
          return this.renderPage()
        } else {
          return <Redirect to='/main' />
        }
      }
    }
  }
  