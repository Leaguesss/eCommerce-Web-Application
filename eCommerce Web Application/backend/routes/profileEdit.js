var express = require('express');

const profileController = require('../controllers/profileEdit.js');

const router = express.Router();


//get a user associated list 
router.get('/api/getlists/:id',profileController.getLists);

//create  a list with this user
router.post('/api/createlist',profileController.createList);

//patch for updating things
router.patch('/api/editlist/:id',profileController.updateList);

//delete
router.delete('/api/deletelist/:id', profileController.deletelist);

//disable
router.patch('/api/disablelist/:id', profileController.disablelist);

//get userinforamtion
router.get('/api/getuser/:id',profileController.getUser);

router.get('/api/userexist/:email',profileController.fetch_email);

//patch for updating things
router.patch('/api/updateuser/:id',profileController.updateUser);


//get userlists
router.get('/api/userlists/:id',profileController.getUserLists);



//patch for updating things
router.patch('/api/updaterating/:id',profileController.updateRating);



router.patch('/api/updatecomment/:id',profileController.updateComment);


router.patch('/api/deletecomment/:id', profileController.deleteComment);





module.exports = router;