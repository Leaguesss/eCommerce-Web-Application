/**
 * 
 */
var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
	firstname: { type: String, required: true }, 
	lastname: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	carts: {}
},{
	versionKey: false
});

//check if there is corresponding email in db
UserSchema.statics.findUserByEmail = function(email, callback){
	return this.find({'email':email})
	.limit(1)
	.exec(callback)
}

//check if the corresponding email with correct pwd
UserSchema.statics.matchEmailWithPwd = function(email, pwd, callback){
	return this.find({'email': email, 'password': pwd})
	.limit(1)
	.exec(callback)
}

//search all users in db
UserSchema.statics.searchUser = function(callback){
	return this.find().exec(callback)
}

//create new user
UserSchema.methods.createUser = function(cb){
	return this.save(cb);
}

//search user based on id
UserSchema.statics.searchUserID = function(id, callback){
	return this.find({'_id':id}).exec(callback)
}

//search batch of reviewer
UserSchema.statics.searchReviewerById = function(ids, callback){
	//return this.find().select('_id firstname lastname').where('_id').in(ids).sort({_id: 1}).exec(callback)
	return this.find().select('_id firstname lastname').where('_id').in(ids).sort({_id: 1}).exec(callback)
}

//search user carts by user id
UserSchema.statics.searchUserCarts = function(id, callback){
	return this.find({'_id':id, carts: { $exists: true }}).select('_id carts').exec(callback)
}

//find if user contains carts field
UserSchema.statics.checkCartsExist = function(id, callback){
	return this.find({'_id': id, carts: { $exists: true }}).exec(callback)
}

//push the phone information to the cart field
UserSchema.statics.addCartField = function(userid, itemBought, callback) {
	//return this.update({'_id':userid}, {$push: {carts: itemBought}}).exec(callback)
	//return this.findOneAndUpdate({'_id':userid},{$push: {'carts': itemBought}}).exec(callback)
	return this.update({'_id':userid}, {$push:{'carts': itemBought}}).exec(callback)
}

//update the item quantity which already exists in the carts
UserSchema.statics.updateItemQuantity = function(itemId, newQuantity, callback){
	return this.update({'carts.itemId':itemId},{'$set':{'carts.$.quantity': newQuantity}}).exec(callback)
}

//edit the item quantity through the check out page
UserSchema.statics.updateItem = function(userid, itemid, quantity, callback){
	return this.update({'_id': userid, 'carts.itemId': itemid}, {'$set': {'carts.$.quantity': quantity}}).exec(callback)
}

//delete an item in the cart
UserSchema.statics.deletItem = function(userid, itemId, callback){
	return this.update({'_id': userid}, {'$pull': {'carts': {'itemId': itemId}}}).exec(callback)
}

//delete the carts field
UserSchema.statics.deletCarts = function(userid, callback){
	return this.update({'_id': userid}, {'$unset': {'carts': true}}).exec(callback)
}

var Userlist = mongoose.model('Userlist', UserSchema, 'userlist')
module.exports = Userlist
