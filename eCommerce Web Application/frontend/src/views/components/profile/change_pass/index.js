import React, {useState}from 'react';
import { TextField,
  Button, Typography,IconButton,Slide,Paper,InputAdornment,Container,AppBar,Grow} from '@material-ui/core';
import useStyles from '../styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {useDispatch,useSelector} from 'react-redux';
import md5 from 'md5';
import { updateUser } from '../actions/user';


const ChangePass = () => {

    const classes = useStyles();
    const [passvalue, setPassvalues] = useState({
      password1: '',
      showPassword1: false,
      password2:'',
      showPassword2: false,
    });
    const dispatch = useDispatch();
    const users = useSelector((state) => state.usersReducer); 
    
    const [currentPassError, setCurrentPassError] = useState('Current Password Field Cannot be Empty');

    const [newPassError, setNewPassError] = useState('New Password Field Cannot be Empty');
    

    const handlePassChange = (prop) => (event) => {
        if(!event.target.value) {
          setCurrentPassError('Current Password Field Cannot be Empty')
        } else{
          setCurrentPassError('')
        }
      setPassvalues({ ...passvalue, [prop]: event.target.value });
    };
  
    const handleClickShowPassword = () => {
      setPassvalues({ ...passvalue, showPassword1: !passvalue.showPassword1 });
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };


    const handlePassChange2 = (prop) => (event) => {
      if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(event.target.value)) {
        setNewPassError('At least eight characters, with one uppercase letter, one lowercase letter, one number and one special character :)')
        
      } else{
        setNewPassError('')
      }

      setPassvalues({ ...passvalue, [prop]: event.target.value });
    };
  
    const handleClickShowPassword2 = () => {
      setPassvalues({ ...passvalue, showPassword2: !passvalue.showPassword2 });
    };
  
    const handleMouseDownPassword2 = (event) => {
      event.preventDefault();
    };

    const clear = () => {
      setPassvalues({
        password1: '',
        showPassword1: false,
        password2:'',
        showPassword2: false,
      })
    };

    const handleSubmit = async (e) =>  {
      e.preventDefault();
      if(newPassError.length ===0 &&currentPassError.length ===0) {
        if(md5(passvalue.password1) === users.password) {
          if(passvalue.password1 === passvalue.password2) {
            setNewPassError("Same Password, No Need To Change")
          }else{
            users.password = md5(passvalue.password2)          
            dispatch(updateUser(users._id, users));
            setCurrentPassError('')
            clear();

          }
          
        }else{
          setCurrentPassError("Authentication Failed")
        }

      }
    }

    




    return (
      <Container maxidth = "lg">
        <AppBar className={classes.appBar} position = "static" color = "inherit">
          {/* text  element */}
          <Typography className={classes.heading} variant = "h2" align = "center"> Change Password</Typography>
        </AppBar>
        <Slide in direction = 'up'>
        <Paper className={classes.paper} position = "">
          <form autoComplete = "off" className = {`${classes.root} ${classes.form}`} onSubmit = {handleSubmit}>
            <Typography variant = "h6">Welcome!</Typography>
                    <TextField
                      variant='outlined'
                      type={passvalue.showPassword1 ? 'text' : 'password'}
                      value={passvalue.password1}
                      onChange={handlePassChange('password1')}
                      label = 'Current Password'
                      fullWidth
                      error ={currentPassError.length === 0 ? false : true } 
                      helperText={currentPassError}
                      InputProps={
                        {
                          endAdornment : (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {passvalue.showPassword1 ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                            )
                        }
                      }/>

                    <TextField
                      variant='outlined'
                      type={passvalue.showPassword2 ? 'text' : 'password'}
                      value={passvalue.password2}
                      onChange={handlePassChange2('password2')}
                      label = 'New Password'
                      fullWidth
                      error ={newPassError.length === 0 ? false : true } 
                      helperText={newPassError}
                      InputProps={
                        {
                          endAdornment : (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword2}
                                onMouseDown={handleMouseDownPassword2}
                                edge="end"
                              >
                                {passvalue.showPassword2 ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                            )
                        }
                      }
                    />  
              <Button className = {classes.buttonSubmit} variant = "contained" color = "primary" size = "large" type = "submit" fullWidth>Submit</Button>
            </form>
        
          
        </Paper>
      </Slide>
    </Container>
      );

}



export default ChangePass;