import React, { Component } from 'react';
import AuthContext from "../../context/AuthContext";
import ConfirmModel from "./confirmModel";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

//import RangeSlider from 'react-bootstrap-range-slider';
import './navbar.css';

import { withRouter } from "react-router-dom";
class Navbar extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleCheckOut = this.handleCheckOut.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.changeToHomeState = this.changeToHomeState.bind(this);
    this.changeToSearchState = this.changeToSearchState.bind(this);
    this.changeRangeValue = this.changeRangeValue.bind(this);
    this.updateSearchString = this.updateSearchString.bind(this);
    this.updateBrandSelect = this.updateBrandSelect.bind(this);

    this.state = {
      redirect: null,
      show: false,
      searchState: false,
      sliderValue: 100,
      searchKey: "",
      brandSelect: "",
    };
  }

  handleSignIn = () => {
    window.location.href = "/auth";
  }
  handleCheckOut = () => {
    window.location.href = "/checkout";
    //this.props.history.push("/checkout");
  }
  handleProfile = () => {
    window.location.href = "/profile/ownprofile";
  }
  handleSignOut = () => {
    this.showModal();
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  updateSearchString = (e) => {
    const { id, value } = e.target;
    this.setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  updateBrandSelect = (e) => {
    this.setState({ brandSelect: e.target.value });
    this.props.setBrandSelect(e.target.value);
  }

  changeRangeValue = (e) => {
    this.setState({ sliderValue: e.target.value });
    this.props.setPrice(e.target.value);
  }

  changeToSearchState = () => {
    //this.setState({ searchState: true });
    if (this.state.searchKey) {
      //console.log("search key: ", encodeURIComponent(this.state.searchKey));
      this.props.setSearchState(true);
      //var searchLoc = "/main/search?title=" + this.state.searchKey;
      var searchLoc = "/main/search?title=" + encodeURIComponent(this.state.searchKey);
      this.props.history.push(searchLoc);
      //window.location.href = searchLoc;
    } else {
      window.alert("You need to input some search strings first!");
    }
  }

  changeToHomeState = () => {
    this.setState({ searchState: false });
    this.props.history.push("/main/home");
  }

  render() {
    const { logState } = this.context;
    //const [loggedIn, getLoggedIn] = logState;
    const [loggedIn, getLoggedIn] = logState;
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <h3 className="navbar-brand loginText fs-4" onClick={() => { this.changeToHomeState() }}>PhoneZone</h3>
          
          {/* Search box for inputting titles */}
          <div className="input-group" style={{ width: "20%" }}>
            <input type="search" className="form-control" 
              placeholder="Search Phone"
              aria-label="Recipient's username" aria-describedby="button-addon2"
              required
              id="searchKey"
              value={this.state.searchKey}
              onChange={this.updateSearchString} />
            <button className="btn btn-outline-secondary" style={{ color: "white" }}
              type="submit" id="button-addon2" onClick={() => { this.changeToSearchState() }}>
              Search
            </button>
          </div>

          {/* Brand filter and price range slider appear only when in search State */}
          {
            //this.state.searchState === true
            this.props.searchState === true
            &&
            <>
              <div className="selectStyle text-white" style={{ width: "12%" }}>
                <select className="form-select py-0" aria-label="Default select brand" onChange={this.updateBrandSelect}>
                  {/* <option value="" hidden="hidden">Brand Filter</option> */}
                  <option value="">Brand Filter</option>
                  <option value="Apple">Apple</option>
                  <option value="HTC">HTC</option>
                  <option value="Huawei">Huawei</option>
                  <option value="LG">LG</option>
                  <option value="Motorola">Motorola</option>
                  <option value="Nokia">Nokia</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Sony">Sony</option>
                  <option value="Blackberry">Blackberry</option>
                </select>
              </div>
              {/* 
              <RangeSlider
                value={this.state.sliderValue}
                onChange={e => this.changeRangeValue(e)}
                variant='warning'
              />*/}
              <div className="priceRange text-white px-2">
                {/* <label className="mb-1" for="price" style={{display: "block"}}>Price Range Slider</label> */}
                <output id="output" defaultValue="0">{this.state.sliderValue}</output>
                <input type="range" className="mb-2" id="priceRange" name="priceRange"
                  min="0" max="1000" step="10"
                  style={{display: "block"}} title="You can drag to change price range"
                  defaultValue="100" onInput={e => this.changeRangeValue(e)}
                  onChange={e => this.changeRangeValue(e)} />
              </div>
            </>
          }

          <div className="nav-btns">
            {loggedIn === false && (
              <button type="button" className="nav-btn" onClick={this.handleSignIn}>Sign In</button>
            )}
            {loggedIn === true && (
              <div className="nav-btns">
                <button type="button" className="nav-btn" onClick={this.handleSignOut}>Sign Out</button>
                <button type="button" className="nav-btn" onClick={this.handleProfile}>Profile</button>
              </div>
            )}
            <button type="button" className="nav-btn" onClick={this.handleCheckOut}>Check Out</button>
            <ConfirmModel show={this.state.show} handleClose={this.hideModal}></ConfirmModel>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);