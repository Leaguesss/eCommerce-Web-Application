import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [user, setUser] = useState(null);

  async function getLoggedIn() {
    await axios.get("http://localhost:5000/account/api/loggedIn").
      then(async function(response){
        //console.log("response is: ", response);
        if (response.status === 200){
          //console.log("logged in Res: ", response.data);
          if(response.data.userId !== null && response.data.userId !== undefined){
            //console.log("response id is: ", response.data.userId);
            await setUser(response.data.userId);
            await setLoggedIn(true);
          } else{
            //console.log("expires");
            await setUser(null);
            await setLoggedIn(false);
          }
          //setLoggedIn(response.data);
        }
      })
  }

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    // <AuthContext.Provider value={{ loggedIn, getLoggedIn }}>
    <AuthContext.Provider value={{ logState: [loggedIn, getLoggedIn], userId: [user, setUser] }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };