import * as api from '../api/index.js';

// Action Creators

export const getLists = (userId) => async (dispatch) => { 
    try {
        const {data} = await api.fetchLists(userId);
        dispatch({type:'FETCH_ALL',payload:data});
    }catch (error) {
        console.log(error);

    }
    
};

//action creators are functions that return an action and an action
// is just an object that has the type and a payload with redux thunk since we
// will be dealing asynchronous logic  we have to add this async disaptch function in front of it
//and then instead of returning the action  we have to dispatch it.
export const createList = (list) => async (dispatch) => {
    try {
      const { data } = await api.createList(list);
  
      dispatch({ type: 'CREATE', payload: data });
    } catch (error) {
      console.log(error);
    }
  };

export const updateList = (id,list) =>  async (dispatch) => {
    try{

      const {data } =  await api.updateList(id,list);

      dispatch({ type: 'UPDATE', payload: data });
    } catch(error) {
      console.log(error);
    }
}
export const deleteList = (id) => async (dispatch) => {
  try {
    await api.deleteList(id);

    dispatch({ type: 'DELETE', payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const disableList = (id) => async (dispatch) => {
  try {
    await api.disableList(id);

    dispatch({ type: 'DISABLE', payload: id });
  } catch (error) {
    console.log(error);
  }
};

