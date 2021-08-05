import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';

import {useDispatch, useSelector} from 'react-redux';

import useStyles from './styles';
import { updateComment,updateRating } from '../actions/userlists';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

//Get the current ID
const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };

const UserForm = ({currentId,userID,setCurrentId}) => {

    const [listData,setListData] = useState('');

    const [errors, setErrors]  = useState('');


    const list = useSelector((state) => (currentId ? state.userListsReducer.find((reviews) => reviews._id === currentId) : null));
    

    const [commentvalue, setcommentValue]  = useState('');

    const classes = useStyles();
    const dispatch = useDispatch();

    const handleValue = (p) =>{
        for (var key in p) {
            if (p.hasOwnProperty(key) && p[key].reviewer === userID) {
                return p[key].rating;
            }
        }
     }
     
    const [value, setValue] = useState(3);
    const [hover, setHover] = useState(-1);
    
    const cleanData = (list) => {
        var a = []
        for (var i = 0;i<list.reviews.length;i++) {
            if (list.reviews[i].reviewer === userID) {
                a.push(list.reviews[i].comment);
            }
        }
        setcommentValue(a)
    }



    useEffect(()=>{
        if(list) {
            cleanData(list);
            setListData(list);
            setValue(handleValue(list.reviews));
            setErrors('');
        }
    },[list])

    const clear = () => {
        setListData('');
        setErrors('');
        setcommentValue('')
        setCurrentId(0);
    };

    
    
    const validate = () => {
        if (!listData) {
            setErrors("Comment Required");
            return false;
        }
        return true;

    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isvalid  = validate();

        if(isvalid) {
            dispatch(updateComment(currentId, listData))
            clear();
        }

    }

    

    const handleonchange  = async (e) => {
        setcommentValue(e.target.value);

        setListData(listData => ({
            reviews: listData.reviews.map( el => el.reviewer === userID ? { ...el, comment: e.target.value}: el)
        }));  
    }

    const handrating = async(newValue) => {
        setValue(newValue);
        setListData(listData => ({
            reviews: listData.reviews.map( el => el.reviewer === userID ? { ...el, rating: newValue}: el)
        }));  
    }
    
    return (
        <Paper className={classes.paper}>
            <form autoComplete = "off" className = {`${classes.root} ${classes.form}`} onSubmit = {handleSubmit}>
            <Typography variant = "h6">{currentId ? 'Update': null} Comments</Typography>

            <TextField name = "Title" 
            multiline variant = "filled" 
            label = "Comments" 
            fullWidth
            disabled = {currentId ? false:true}
            error ={errors.length === 0 ? false : true } 
            helperText={errors}
            value = {commentvalue}
            inputProps={{style: {fontSize: 14}}}
            onChange={handleonchange}/>

            <Rating
                name="feedback"
                disabled = {currentId ? false:true}
                value={value}
                precision={0.5}
                onChange={(event, newValue) => {handrating(newValue);
                }}
                onChangeActive={(event, newHover) => {
                setHover(newHover);
                }}
            />
            

            {/* {value !== null && <Box ml={2}> {labels[hover !== -1 ? hover : value]} </Box>} */}
            {currentId ?
            <React.Fragment>
            <Button className = {classes.buttonSubmit} variant = "contained" color = "primary" size = "large" type = "submit" fullWidth>Update</Button>
            <Button  variant = "contained" color = "secondary" size = "small" onClick={clear} fullWidth>Close</Button>
            </React.Fragment>
            : null
            }
            </form>

        </Paper>

    );
}

export default UserForm;