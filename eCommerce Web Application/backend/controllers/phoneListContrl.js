var Phonelist = require("../models/phoneList");
const Userlist = require("../models/userAccount");

// Search 5 phone listings that have the least quantity available
module.exports.searchLeastQuantityPhone = async function (req, res) {
	await Phonelist.searchLeastQuantity(function (err, result) {
		if (err || result.length === 0){
			console.log("Cannot find proper series of phones with least quantity!")
		}else{
			revision = result[0];
			// console.log(revision);
			res.json(result);
		}
	})
}

// Search 5 phone listings that have the highest average ratings
module.exports.searchHighestRatingPhone = async function (req, res) {
	await Phonelist.searchHighestRating(function (err, result) {
		if (err || result.length === 0){
			console.log("Cannot find proper series of phones with highest average ratings!")
		}else{
			revision = result[0];
			res.json(result);
		}
	})
}

// Search phone listings by titles
function escapeRegex(text) {
	return text.replace(/[[-\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.searchPhoneByTitle = async function(req, res){
	title = escapeRegex(req.query.title);
	title2 = req.query.title;
	if(title === undefined || title.length === 0){
		res.status(400).send("Empty search string key");
	} else{
		await Phonelist.searchTitle(title, function (err, result){
			if(err || result.length === 0 ){
				console.log("Cannot find such relevant titles");
				var errorInfo = "Cannot find such relevant phone listing for " + title2;
				res.status(401).send(errorInfo);
			} else{
				searchResult = result;
				//console.log(searchResult.length);
				res.json(searchResult);
			}
		})
	}
}

// Return the details of the selected phone based on id
module.exports.searchSelectedPhone = async function (req, res) {
	id = req.query.id
	await Phonelist.searchSelected(id, function (err, result) {
		if (err){
			console.log("Cannot find the phone!")
		}else{
			revision = result[0];
			res.json(result);
		}
	})
}


module.exports.addReviews = async function(req, res){
	itemId = req.body.itemId;
	var review = {
		reviewer: req.body.reviewer,
        rating: req.body.rating,
		comment: req.body.comment
	};
	await Phonelist.addNewComments(itemId, review, function(err, result){
		if(err || result.length === 0){
			var errorInfo = "Cannot add new comments to the phone!";
			res.status(500).json(errorInfo);
		} else{
			Userlist.searchUserID(req.body.reviewer, function(err, result){
				if(err || result.length === 0){
					var errorInfo = "Cannot find such user!";
					res.status(401).json(errorInfo);
				} else{
					var reviewerInfo = {
						_id: req.body.reviewer,
						firstname: result[0].firstname,
						lastname: result[0].lastname
					}
					res.json(reviewerInfo);
				}
			})
		}
	})
}

// User purchase update
module.exports.buyPhones = async function (req, res) {
	itemId = req.query.id;
	newQuantity = req.query.quantity;
	Phonelist.buyPhones(itemId, newQuantity, function (err, result) {
		if (err){
			console.log("Cannot find proper series of phones with highest average ratings!")
		}else{
			Phonelist.searchSelected(itemId, function (err, result) {
				if (err){
					console.log("Cannot find the phone!")
				}else{
					revision = result[0];
					res.json(result);
				}
			})
		}
	})
}