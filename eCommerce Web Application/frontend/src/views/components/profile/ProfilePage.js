import React,{useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {getUser} from './actions/user';
import EditProfile from './edit_profile'

function ProfilePage({userID}) {

  const dispatch = useDispatch();
  useEffect(() =>{
    dispatch(getUser(userID));
  }, [userID,dispatch]);
  
  return (
    <EditProfile/>
  );
};

export default ProfilePage;