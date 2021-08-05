import React, {useEffect}from 'react';
import {useDispatch} from 'react-redux';
import ChangePass from './change_pass'
import {getUser} from './actions/user';

const ChangePasswordPage = ({userID}) => {
  const dispatch = useDispatch();
  useEffect(() =>{
    dispatch(getUser(userID));
  }, [userID,dispatch]);

  return(
    <ChangePass/>
  )

    

}



export default ChangePasswordPage;