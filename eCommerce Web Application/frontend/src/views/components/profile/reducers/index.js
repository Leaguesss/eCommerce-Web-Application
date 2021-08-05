import {combineReducers} from 'redux';
import postsReducer from './posts';
import usersReducer from './users';
import userListsReducer from './userlists';


export default combineReducers({postsReducer,usersReducer,userListsReducer});