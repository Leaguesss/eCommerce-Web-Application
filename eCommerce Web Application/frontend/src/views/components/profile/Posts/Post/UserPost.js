import React, {useEffect,useState} from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import useStyles from './styles';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import Images from "../../../images";
import Rating from '@material-ui/lab/Rating';

import { deleteComment } from '../../actions/userlists';

var imgdict = {'Apple':Images.Apple, 'BlackBerry':Images.BlackBerry, 'HTC':Images.HTC, 'Huawei':Images.Huawei,
 'LG':Images.LG, 'Motorola':Images.Motorola, 'Nokia':Images.Nokia, 'Samsung':Images.Samsung, 'Sony':Images.Sony};

const UserPost = ({post, userID,setCurrentId }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    var imagepath = null;

    const handleValue = (p) =>{
        for (var key in p) {
            if (p.hasOwnProperty(key) && p[key].reviewer === userID) {
                return p[key].rating;
            }
        }
     }
    
    const [value, setValue] = useState(handleValue(post.reviews));


    for(var key in imgdict) {
        if (key == post.brand) {
            imagepath = imgdict[key]
            break
        }
       
      }

    const [listData,setListData] = useState(post);

    // const [hover, setHover] = useState(-1);
    useEffect(() =>{
        setListData(listData => ({
            reviews: listData.reviews.filter( (ele) => ele.reviewer !== userID ? ele : null )
        }));
        setValue(handleValue(post.reviews));
    }, [post]);


    return (
        <Card className = {classes.card}>
            
            <CardMedia className = {classes.media} image={imagepath || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.brand} />

            <div className={classes.overlay}>
                <Typography variant="h6">{post.brand}</Typography>
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

            <CardContent>
            <Typography variant="body2" color="textSecondary" component = "p" >{post.reviews.map((review)=> review.reviewer===userID ? (`${review.comment} `) :null  )}  </Typography>
            

            <Rating name="read-only" precision={0.5} value={value} readOnly/>
            </CardContent>
            <CardActions className={classes.cardActions} >
                

                <Button size = "small" color = "primary" onClick = {() => dispatch(deleteComment(post._id, listData))}>
                    <DeleteIcon fontSize="small"/>
                    Delete
                </Button>

            </CardActions>


        </Card>
    );
}

export default UserPost;
