import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper,InputAdornment } from '@material-ui/core';

import {useDispatch, useSelector} from 'react-redux';

import useStyles from './styles';
import { createList,updateList } from '../actions/lists';
import MenuItem from '@material-ui/core/MenuItem';



//Get the current ID

const Form = ({currentId,userID, setCurrentId}) => {

    const phones = [
        {
          value: '../images/Apple.jpeg',
          label: 'Apple',
        },
        {
          value: '../images/Sony.jpeg',
          label: 'Sony',
        },
        {
          value: '../images/HTC.jpeg',
          label: 'HTC',
        },
        {
          value: '../images/Samsung.jpeg',
          label: 'Samsung',
        },
        {
            value: '../images/Huawei.jpeg',
            label: 'Huawei',
        },
        {
            value: '../images/Motorola.jpeg',
            label: 'Motorola',
        },
        {
            value: '../images/Nokia.jpeg',
            label: 'Nokia',
        },
        {
            value: '../images/BlackBerry.jpeg',
            label: 'BlackBerry',
        },
        {
            value: '../images/LG.jpeg',
            label: 'LG',
        },
      ];


    const [listData,setListData] = useState({
        title:'', brand:'',image:'',stock:'',price:'', seller:userID, disabled:null
    });

    const [errors, setErrors]  = useState({titleError:'', brandError:'',stockError:'',priceError:''});

    const list = useSelector((state) => (currentId ? state.postsReducer.find((title) => title._id === currentId) : null));
    const classes = useStyles();
    const dispatch = useDispatch();



    useEffect(()=>{
        if(list) {
            setListData(list);
            setPhone(list.image);
            setErrors({titleError:'', brandError:'',stockError:'',priceError:''});
        }
    },[list])

    const clear = () => {
        setCurrentId(0);
        setListData({ title:'', brand:'',image:'',stock:'',price:'',seller:userID, disabled:null });
        setErrors({titleError:'', brandError:'',stockError:'',priceError:''});
        setPhone('');
    };

    
    
    const validate = () => {
        let titleErrormes = '';
        let brandErrormes = '';
        let stockErrormes = '';
        let priceErrormes = '';

        
        if (listData.title == '') {
            titleErrormes = "Title Required";
        }
        if (listData.brand ==  '') {
            brandErrormes = "Brand Required";
        }
        
        if (listData.stock == '') {
            stockErrormes = "Stock Required";
            
        } else {
            const stocknum = parseInt(listData.stock, 10);
            if (stocknum <= 0) {
                stockErrormes = "Stock Can Only Be Positivate Integer";
            } else{
                if (listData.stock != stocknum) {
                    stockErrormes = "Stock Can Only Be Positivate Integer";
                }
            }
        }

        if (listData.price == '') {
            priceErrormes = "Price Required";
        
        } else{
            if (listData.price <= 0) {
                priceErrormes = "Price Can not be negative or zero";
            }
        }        
        setErrors({titleError:titleErrormes, brandError:brandErrormes,stockError:stockErrormes,priceError:priceErrormes});
        if (titleErrormes || brandErrormes || stockErrormes || priceErrormes) {
            return false;
        }
        return true;

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isvalid  = validate();


        if(isvalid) {
            if (currentId === 0) {
                dispatch(createList(listData));
            } else {
                dispatch(updateList(currentId, listData));
            }
            clear();
            
        }

    }


    
      

    const [phone, setPhone] = useState('');
    const handlephone = (event) => {
    
    setPhone(event.target.value);
    var brandvalue = event.target.value;
    brandvalue = brandvalue.replace("../images/","");
    brandvalue = brandvalue.replace(".jpeg","");
    setListData({...listData, brand:brandvalue, image:event.target.value });
    };
   
    

    // const handleTitleChange = (e) => {
    //     setListData({...listData, title:e.target.value})
    //     setErrors({...errors, })

    // }

    return (
        <Paper className={classes.paper}>
            <form autoComplete = "off" className = {`${classes.root} ${classes.form}`} onSubmit = {handleSubmit}>
            <Typography variant = "h6">{currentId ? 'Editing': 'Creating'} a Phone List</Typography>
            <TextField name = "Title" 
            multiline variant = "filled" 
            label = "Title" fullWidth
            error ={errors.titleError.length === 0 ? false : true } 
            helperText={errors.titleError}
            value = {listData.title} 
            onChange={(e) => setListData({...listData, title:e.target.value})}/>
            
            <TextField select 
            label="Select Your Brand" 

            error ={errors.brandError.length === 0 ? false : true } 
            helperText={errors.brandError}

            value={phone} variant="filled" 
            onChange={handlephone}  fullWidth>
                <MenuItem value="" disabled>
                Please Select One
                </MenuItem>
                {phones.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
            </TextField>

            <TextField name = "Stock" 
            variant = "filled"
            type="number" 
            InputProps={{
                inputProps: { 
                     min: 0 
                },
                
            }}
            InputLabelProps={{ shrink: true }}
            
            error ={errors.stockError.length === 0 ? false : true } 
            helperText={errors.stockError}

            label = "Stock" 
            fullWidth value = {listData.stock} 
            onChange={(e) => setListData({...listData, stock:e.target.value})}/>


            <TextField name = "Price" variant = "filled" 
            type="number" 
            label = "Price"
            InputProps={{
                inputProps: { 
                     min: 0, max:1000
                },
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            
            InputLabelProps={{ shrink: true }}
            error ={errors.priceError.length === 0 ? false : true } 
            helperText={errors.priceError}
            
            fullWidth value = {listData.price} 
            onChange={(e) => setListData({...listData, price:e.target.value})}/>


            <Button className = {classes.buttonSubmit} variant = "contained" color = "primary" size = "large" type = "submit" fullWidth>{currentId ? 'Edit': 'Submit'} </Button>
            <Button  variant = "contained" color = "secondary" size = "small" onClick={clear} fullWidth>Clear</Button>

            </form>

        </Paper>

    );
}

export default Form;