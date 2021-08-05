import axios from 'axios';

const getlist = 'http://localhost:5000/profile/api/getlists';
const createlist = 'http://localhost:5000/profile/api/createlist';
const editlist = 'http://localhost:5000/profile/api/editlist';
const deletelist = 'http://localhost:5000/profile/api/deletelist';
const disablelist = 'http://localhost:5000/profile/api/disablelist';
const getuser = 'http://localhost:5000/profile/api/getuser';
const updateuser = 'http://localhost:5000/profile/api/updateuser';
const getuserlists = 'http://localhost:5000/profile/api/userlists';
const updaterating = 'http://localhost:5000/profile/api/updaterating';
const updatecomment = 'http://localhost:5000/profile/api/updatecomment';
const deletecomment = 'http://localhost:5000/profile/api/deletecomment';
const userexist = 'http://localhost:5000/profile/api/userexist';


export const fetchLists = (userId)  => axios.get(`${getlist}/${userId}`);
export const createList = (newList) => axios.post(createlist, newList)
export const updateList = (id, listdata) => axios.patch(`${editlist}/${id}`, listdata);
export const deleteList = (id) => axios.delete(`${deletelist}/${id}`);
export const disableList = (id) => axios.patch(`${disablelist}/${id}`);
export const getUser = (userId) => axios.get(`${getuser}/${userId}`);

export const userExist = (email)  => (axios.get(`${userexist}/${email}`));

export const updateUser = (id,user) => axios.patch(`${updateuser}/${id}`,user);
export const getUserLists = (userId)  => axios.get(`${getuserlists}/${userId}`);

export const updateRating = (postid, listData) => axios.patch(`${updaterating}/${postid}`,listData);

export const updateComment = (postid,listData) => axios.patch(`${updatecomment}/${postid}`,listData);

export const deleteComment = (postid,listData) => axios.patch(`${deletecomment}/${postid}`,listData);


