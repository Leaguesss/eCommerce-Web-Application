var express = require('express')
var phoneListController = require('../controllers/phoneListContrl');
var userAccountController = require('../controllers/userAccountContrl');
const app = require('../server');
var router = express.Router();

router.get('/leastquantity', phoneListController.searchLeastQuantityPhone);
router.get('/highestratings', phoneListController.searchHighestRatingPhone);
router.get('/searchTitle', phoneListController.searchPhoneByTitle);
router.get('/item', phoneListController.searchSelectedPhone);
router.get('/item/seller', userAccountController.searchSelectedUser);
router.post('/item/reviewer', userAccountController.searchReviewersById);

router.patch('/item/api/addtocart', userAccountController.addToCart);
router.get('/item/api/editcarts', userAccountController.editItem);
router.get('/item/api/deleteitem', userAccountController.deleteItem);
router.get('/item/api/buyphones', phoneListController.buyPhones);
router.get('/item/api/deletecarts', userAccountController.deleteCarts);

router.post('/item/api/currentItemQuantityInCarts', userAccountController.currentItemQuantityInCarts);

router.post('/item/api/addNewComments', phoneListController.addReviews);

module.exports = router;