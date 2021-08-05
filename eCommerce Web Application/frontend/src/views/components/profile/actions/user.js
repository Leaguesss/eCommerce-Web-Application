import * as api from '../api/index.js';

export const getUser = (userId) => async (dispatch) => { 
    try {
        const {data} = await api.getUser(userId);
        dispatch({type:'FETCH_USER',payload:data});
    }catch (error) {
        console.log(error);
  
    }
    
  };


export const updateUser = (id,user) =>  async (dispatch) => {
    try{

      const {data} =  await api.updateUser(id,user);

      dispatch({ type: 'UPDATE_USR', payload: data });
    } catch(error) {
      console.log(error);
    }
};





