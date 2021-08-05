import React from 'react';
import {Grid, CircularProgress} from '@material-ui/core';

import UserPost from './Post/UserPost';
import useStyles from './styles';
import  {useSelector} from 'react-redux';


const UserPosts = ( {setCurrentId, userID}) => {

    const userlists = useSelector((state) => state.userListsReducer); 
    

    const classes = useStyles();
    

    return (
        !userlists ? <CircularProgress /> :( //Loading 
            <Grid className={classes.container} container alignItems = "stretch" spacing={3}>
                {userlists.map((post) => (
                    <Grid key={post._id} item xs={12} sm={6}>
                    <UserPost post={post} userID={userID} setCurrentId={setCurrentId} />
                    </Grid>
                    
                ))}

            </Grid>
        )
    );
}

export default UserPosts;