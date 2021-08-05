import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/home/navbar.component"
import DefaultPhoneList from "./components/home/home.component"

import SearchPage from "./components/home/search.component"
import ItemDetail from "./components/home/item.component"
import AuthContext from "./context/AuthContext";

import { withRouter } from "react-router-dom";

function Home() {
    //const { loggedIn } = useContext(AuthContext);
    const [searchState, setSearchState] = useState(false);
    const [brandSelect, setBrand] = useState(null);
    const [priceRange, setPrice] = useState(100);

    const { logState, userId } = useContext(AuthContext);
    const [loggedIn, getLoggedIn] = logState;
    const [user, setUser] = userId;

    return (
        <div className="main">
            <Router>
                <Navbar searchState={searchState} setSearchState={setSearchState}
                    brandSelect={brandSelect} setBrandSelect={setBrand}
                    priceSelect={priceRange} setPrice={setPrice} />
                <div className="container">
                    <Switch>
                        <Route path='/main/' exact component={DefaultPhoneList} >
                            <DefaultPhoneList setSearchState={setSearchState} />
                        </Route>
                        <Route path='/main/home' exact component={DefaultPhoneList} >
                            <DefaultPhoneList setSearchState={setSearchState} />
                        </Route>
                        <Route path='/main/search' exact component={SearchPage} >
                            <SearchPage setSearchState={setSearchState}
                                brandSelect={brandSelect} priceSelect={priceRange} />
                        </Route>
                        <Route path='/main/item/' exact component={ItemDetail}>
                            <ItemDetail setSearchState={setSearchState} userID={user}/>
                        </Route>
                        <Redirect from="/main" to="/main/" exact />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}
export default withRouter(Home);