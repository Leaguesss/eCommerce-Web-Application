import * as api from '../api/index.js';


export const getUserlists = (userId) => async (dispatch) => { 
    try {
        const {data} = await api.getUserLists(userId);
        dispatch({type:'FETCH_USER_LISTS',payload:data});
    }catch (error) {
        console.log(error);
  
    }
    
  };



export const updateRating = (postid, listData) => async (dispatch) => { 
    try {
        const {data} = await api.updateRating(postid, listData);
        dispatch({type:'UPDATE_RATING',payload:data});
    }catch (error) {
        console.log(error);
  
    }
    
  };
  

export const updateComment = (postid, listData) => async (dispatch) => { 
    try {
        const {data} = await api.updateComment(postid, listData);
        dispatch({type:'UPDATE_COMMENT',payload:data});
    }catch (error) {
        console.log(error);
  
    }
    
  };

export const deleteComment = (postid, listData) => async (dispatch) => {
    try {
        const {data} = await api.deleteComment(postid, listData);
        dispatch({type:'DELETE_COMMENT',payload:data});
    }catch (error) {
        console.log(error);
  
    }
}
