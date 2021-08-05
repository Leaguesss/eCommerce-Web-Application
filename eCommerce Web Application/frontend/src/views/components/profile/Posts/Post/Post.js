import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import useStyles from './styles';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import Switch from '@material-ui/core/Switch';
import { useDispatch } from 'react-redux';
import { deleteList,disableList } from '../../actions/lists';
import Images from "../../../images";

var imgdict = {'Apple':Images.Apple, 'BlackBerry':Images.BlackBerry, 'HTC':Images.HTC, 'Huawei':Images.Huawei,
 'LG':Images.LG, 'Motorola':Images.Motorola, 'Nokia':Images.Nokia, 'Samsung':Images.Samsung, 'Sony':Images.Sony};

const Post = ({post, setCurrentId }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    var imagepath = null;
    var b1 = false;
    var b2 = false;
    if (post.disabled == null || post.disabled== "false") {
        b1 = false
        b2 = false;
    }else{
        b1 = true;
        b2 = true;
    }
    
    

    const [state, setState] = React.useState({
        
        checkedA: b1,
        checkedB: b2,
      });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        handleDisable();
        
    };

    
    for(var key in imgdict) {
        if (key == post.brand) {
            imagepath = imgdict[key]
            break
        }
       
      }
    const handleDisable = async () => {

        dispatch(disableList(post._id))
    }
    
    return (
        <Card className = {classes.card}>
            
            <CardMedia className = {classes.media} image={imagepath || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.brand} />
            <div className={classes.overlay}>
                <Typography variant="h6">{post.brand}</Typography>
                <Typography variant="body2">{moment(post.createdAt).fromNow()} </Typography>

            </div>

            <div className={classes.overlay2}>
                
                <Button style={{ color: 'white' }} size="small" onClick={() => setCurrentId(post._id)}>
                    <MoreHorizIcon fontSize = "default"/>
                </Button>
                
            </div>


            <div className = {classes.details}>
                <Typography variant="body2" color="textSecondary" component="h2" >Price: {post.price} </Typography>
                <Typography variant="body2" color="textSecondary" component="h2">Stock: {post.stock} </Typography>
            </div>


            <Typography className={classes.title} variant="h6" gutterBottom >{post.title}</Typography>
            
            {/* <CardContent>
            <Typography variant="body2" color="textSecondary" component = "p" >{post.reviews.map((review)=> (`#${review.comment} `) ) }  </Typography>
            </CardContent> */}

            <CardActions className={classes.cardActions} >
                <Button size = "small" color = "primary" onClick = {() =>{}}>
                    {state.checkedB ? 'Disable': 'Enable'}
                    <Switch
                        checked={state.checkedB}
                        onChange={handleChange}
                        color="primary"
                        name="checkedB"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        
                    />

                </Button>
                

                <Button size = "small" color = "primary" onClick = {() =>dispatch(deleteList(post._id))}>
                    <DeleteIcon fontSize="small"/>
                    Delete
                </Button>

            </CardActions>


        </Card>
    );
}

export default Post;