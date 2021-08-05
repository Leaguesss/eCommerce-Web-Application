import React, {useState, useEffect} from 'react';
import {Container,AppBar,Typography,Grow,Grid} from '@material-ui/core';
import UserPosts from './Posts/UserPosts';
import UserForm from './Form/UserForm';
import useStyles from './styles';
//dispatch an action
import {useDispatch} from 'react-redux';
import {getUserlists} from './actions/userlists';



const UserListingPage = ({userID}) => {

  const [currentId, setCurrentId] = useState(0);

  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() =>{
    dispatch(getUserlists(userID));
  }, [currentId,dispatch]);



  
  return (
    //center everything
    <Container maxidth = "lg">
      <AppBar className={classes.appBar} position = "static" color = "inherit">
        {/* text  element */}
        <Typography className={classes.heading} variant = "h2" align = "center"> User Listings</Typography>
        {/* <img className={classes.image} src={weblogo} alt="icon" height="60" /> */}
      </AppBar>

      {/* simple animation element */}
      <Grow in>
        <Container>
          <Grid className={classes.mainContainer} container justify = "space-between" alignItems="stretch" spaceing = {3}>
            <Grid item xs={12} sm={7}>
              <UserPosts setCurrentId={setCurrentId}  userID={userID} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UserForm currentId={currentId}  userID={userID}  setCurrentId={setCurrentId}/>
            </Grid>
          </Grid>
        </Container>

      </Grow>


    </Container>
      
  );

}

export default UserListingPage;