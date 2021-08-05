import React from 'react';
import {
  NavLink,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
import axios from "axios";



const Navbar = ({loggedIn}) => {
  const handleLogOut = () => {
    axios.get("http://localhost:5000/account/api/logout")
        .then(function (response) {
            if (response.status === 200) {
                window.location.href = "/main";
            }
    })
  };
  const handleSignin = () => {
    window.location.href = "/auth";
  }
  return (

      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{height:"100%"}}>
        <NavLink to="/main" onClick={() => window.location.href = "/main"} className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none" >
          <span className="fs-3">PhoneZone</span>
        </NavLink>
        <hr />
        <ul className="nav nav-pills flex-column mt-5">
          <li className="nav-item">
            <NavLink to="/profile/ownprofile" className="nav-link text-white"><span className="fs-5">Profile</span></NavLink>
          </li >
          <li className="nav-item mt-5">
            <NavLink to="/profile/changepassword" className="nav-link text-white"><span className="fs-5">Change Password</span></NavLink>
          </li>
          <li className="nav-item mt-5">
            <NavLink to="/profile/managelisting" className="nav-link text-white"><span className="fs-5">Manage Listing</span></NavLink>
          </li>
          <li className="nav-item mt-5">
            <NavLink to="/profile/userlisting" className="nav-link text-white"><span className="fs-5">User Listing</span></NavLink>
          </li>
        </ul>
        <hr />
        <NavBtn className="mt-5">
          {loggedIn
          ? <NavBtnLink to='/main' onClick={handleLogOut}>Logout</NavBtnLink>
          : <NavBtnLink to='/auth' onClick={handleSignin}>Sign In</NavBtnLink> }

        </NavBtn>
      </div>

  );
};

export default Navbar;
