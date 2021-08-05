import React, { useContext } from 'react';

import { withRouter } from "react-router-dom";
import AuthContext from "./context/AuthContext";

import ItemList from "./components/checkOut/itemList"
import PageTitle from "./components/checkOut/pageTitle"

function CheckOut(props) {
  //const { loggedIn } = useContext(AuthContext);
  const { logState, userId } = useContext(AuthContext);
  const [loggedIn, getLoggedIn] = logState;
  const [user, setUser] = userId;

  const redirectToSignIn = () => {
    props.history.push('/auth');
  }
  
  return (
    <div className="container">
      <main>
        {/* <Link className="btn btn-success" to={{pathname:props.history.goBack()}}>Go Back</Link> */}
        {/* top button */}
        <div className="row my-5 py-3 border bg-white shadow" style={{borderRadius: "15px"}}>
          <div className="col text-start">
            <button type="button" className="btn btn-success" style={{borderRadius: "15px"}} onClick={() => {
              props.history.goBack()
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
              </svg>
              {' '}
            Go Back
          </button>
          </div>
          {loggedIn === false
            &&
            <div className="col text-end">
              <span className="text-secondary"><i>You haven't signed in yet. </i></span>
              <button type="button" className="btn btn-danger" style={{borderRadius: "15px"}} onClick={redirectToSignIn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
                {' '}
              Sign In here
              </button>
            </div>
          }
        </div>

        {/* middle title and instructions */}
        <div className="row">
          <PageTitle></PageTitle>
        </div>

        {/* bottom itemList and summary box */}
        {loggedIn === true
          &&
          <ItemList></ItemList>
        }
      </main>
    </div>
  );
}

export default withRouter(CheckOut);