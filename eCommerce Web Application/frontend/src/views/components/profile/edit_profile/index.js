import React,{useEffect,useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { TextField,FormHelperText,Dialog ,DialogActions,
  FormControl,DialogContent,DialogTitle,DialogContentText,
  Button, Typography,OutlinedInput,IconButton,Zoom,Paper,InputAdornment,Container,AppBar,Grow} from '@material-ui/core';
import useStyles from '../styles';
import EmailIcon from '@material-ui/icons/Email';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import md5 from 'md5';
import { updateUser } from '../actions/user';
import {userExist} from '../api'

function EditProfile() {


  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const users = useSelector((state) => state.usersReducer); 
  const [errors, setErrors]  = useState({firstnameError:'', lastnameError:'',emailError:''});
  const [user, setUser] = useState({firstname:'',lastname:'',email:'',password:''});
  const [disable, setDisable]  = useState(true);
  const [confirmError, setconfirmError] = useState('');
  const handleClickOpen = () => {
    setconfirmError('');
    setOpen(true);
          
  };

  const handleClose = () => {
    setOpen(false);
    setPassvalues({
      password: '',
      showPassword: false,
    })
  };

  
  
  useEffect(()=>{
    if(users) {
      setUser(users);
      setErrors({firstnameError:'', lastnameError:'',emailError:''});

    }
  },[users]);

  const isvalid = () => {

    if (errors.firstnameError.length>0 || errors.lastnameError.length>0 || errors.emailError.length>0 || 
      user.firstname ==='' ||  user.lastname==='' ||  user.email==''
    
    ) {
        return false;
    }
    return true;
  }
  
  const handleSubmit = async (e) =>{
    e.preventDefault();

    if(disable){
      setDisable(false);
    } else{
      if (user.firstname == users.firstname && user.lastname == users.lastname && user.email == users.email) {
        setDisable(true);
      } else{
        if(isvalid()) {
            const response = await userExist(user.email)
            if (response.data ) {
                setErrors({...errors, emailError:"Email Already Exists"});
            } else{
                handleClickOpen();
            }


        }

      }
         
    }
    
  };
  
  const classes = useStyles();

  const clear = () => {
    setUser({firstname:'',lastname:'',email:'',password:users.password});
    setErrors({firstnameError:'', lastnameError:'',emailError:''});
  };

  
  const handleFirstname = async (e) =>{ 
    e.preventDefault();
    if (e.target.value.length < 1) {
      setErrors({...errors, firstnameError:'Can Not Be Empty'});
    }else{
      if (!e.target.value.match(/^[a-zA-Z]+$/)) {
        setErrors({...errors, firstnameError:'Only Allow Letters'});
      } else{
        setErrors({...errors, firstnameError:''});
      }
    }
    setUser({...user, firstname:e.target.value});

  };
  const handlLastname = async (e) =>{ 
    e.preventDefault();

    if (e.target.value.length < 1) {
      setErrors({...errors, lastnameError:'Can Not Be Empty'});
    }else{
      if (!e.target.value.match(/^[a-zA-Z]+$/)) {
        setErrors({...errors, lastnameError:'Only Allow Letters'});
      } else{
        setErrors({...errors, lastnameError:''});
      }
    }
    setUser({...user, lastname:e.target.value});
  };
  const handleEmail = async (e) =>{ 
    e.preventDefault();
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( !String(e.target.value).toLowerCase().match(re) ) {
      setErrors({...errors, emailError:'Invalid Email Format'});
    } else{
      setErrors({...errors, emailError:''});
    }
    setUser({...user, email:e.target.value});
  };
  
  const [passvalue, setPassvalues] = useState({
    password: '',
    showPassword: false,
  });

  const handlePassChange = (prop) => (event) => {
    setPassvalues({ ...passvalue, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setPassvalues({ ...passvalue, showPassword: !passvalue.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  
  const handleConfirm = async () => {
    if( md5(passvalue.password) === users.password) {
      handleClose();
      setDisable(true);
      dispatch(updateUser(users._id, user));
      return true;
    }

    setconfirmError('Wrong PassWord, Please Try Again! :(');

    return false;
  }

  return (
    
    <Container maxidth = "lg">
        <AppBar className={classes.appBar} position = "static" color = "inherit">
          {/* text  element */}
          <Typography className={classes.heading} variant = "h2" align = "center"> Profile</Typography>
        </AppBar>

    <Zoom in style={{ transitionDelay:'150ms'}}>
        <Paper className={classes.paper} position = "">
            <form autoComplete = "off" className = {`${classes.root} ${classes.form}`} onSubmit = {handleSubmit}>
            <Typography variant = "h6">Hi! {users.firstname}, Welcome Come Back!</Typography>
              <TextField name = "firstname" 
                    multiline variant = "outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start"
                        classes={{ positionStart: classes.centerAdornment}}
                        >
                          <b>First Name:</b>
                        </InputAdornment>
                      ),
                      
                    }}

                    disabled = {disable}
                    fullWidth
                    error ={errors.firstnameError.length === 0 ? false : true } 
                    helperText={
                      <Typography 
                        variant="caption" 
                        className={classes.centerText}
                        display="block"
                      >
                           {errors.firstnameError}
                      </Typography>
                     
                    }
                    value = {user.firstname} 
                    onChange={handleFirstname}/>

              <TextField name = "lastname" 
                    multiline variant = "outlined" 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start"
                        classes={{ positionStart: classes.centerAdornment}}
                        >
                          <b>Last Name:</b>
                        </InputAdornment>
                      ),
                    }}
                    
                    disabled = {disable}
                    fullWidth
                    error ={errors.lastnameError.length === 0 ? false : true } 
                    helperText={
                      <Typography 
                        variant="caption" 
                        className={classes.centerText}
                        display="block"
                      >
                      {errors.lastnameError}
                      </Typography>
                      
                    }
                    value = {user.lastname} 
                    onChange={handlLastname}/>

              <TextField name = "email" 
                    multiline variant = "outlined" 
                    type = "email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" 
                        classes={{ positionStart: classes.centerAdornment}}
                        >
                          <EmailIcon />
                        </InputAdornment>
                      ),
                
                    }}
                    

                    disabled = {disable}
                    fullWidth
                    error ={errors.emailError.length === 0 ? false : true } 
                    helperText={
                      <Typography 
                        variant="caption" 
                        className={classes.centerText}
                        display="block"
                      >
                           {errors.emailError}
                      </Typography>
                      }
                    value = {user.email} 
                    onChange={handleEmail}/>

            <Button className = {classes.buttonSubmit} variant = "contained" color = "primary" size = "large" type = "submit" fullWidth>{disable ? 'Editing': 'Submit'}</Button>
            {disable ? null : <Button  variant = "contained" color = "secondary" size = "small" onClick={clear} fullWidth>Clear</Button>}
            </form>
        

          {/* dialog here */}
          <React.Fragment>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="max-width-dialog-title"
            >
              <DialogTitle id="max-width-dialog-title">Confirm You Password!</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please Type Your Password Below, Thanks!
                </DialogContentText>   
                <div>
                  <FormControl className={classes.dialogmargin, classes.dialogtextField} variant="filled">
                    <TextField
                      variant='outlined'
                      type={passvalue.showPassword ? 'text' : 'password'}
                      value={passvalue.password}
                      onChange={handlePassChange('password')}
                      label = 'Password'

                      error ={confirmError.length === 0 ? false : true } 
                      helperText={confirmError}
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
                                {passvalue.showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                            )
                        }
                      }
                      
                    />
                  </FormControl> 
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleConfirm} color="primary">
                
                  Confirm
                </Button>

                <Button onClick={handleClose} color="primary">
                  Close
                </Button>

              </DialogActions>
            </Dialog>
          </React.Fragment>
        </Paper>
      </Zoom>
    </Container>

    
  );
};

export default EditProfile;