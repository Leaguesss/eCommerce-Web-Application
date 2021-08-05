var express = require('express')
var userAccountController = require('../controllers/userAccountContrl');
const app = require('../server');
var router = express.Router();

router.post('/api/login', userAccountController.getUser);
//router.get('/api/searchUser', userAccountController.searchUser);
router.get('/api/loggedIn', userAccountController.loggedIn);
router.post('/api/register', userAccountController.createUser);
router.get('/api/logout', userAccountController.logOut);
router.get('/searchuser', userAccountController.searchAUser);

//router.post('/api/searchUserById', userAccountController.searchReviewersById);
//router.get('/searchuser', userAccountController.searchSelectedUser);

module.exports = router;

