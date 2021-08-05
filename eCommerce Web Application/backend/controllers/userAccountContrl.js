var Userlist = require("../models/userAccount");
var Phonelist = require("../models/phoneList");
var md5 = require('md5');
const jwt = require("jsonwebtoken");

//find specific User using pwd and email
module.exports.getUser = async function (req, res) {
	email = req.body.email;
	pwd = req.body.password;

	await Userlist.findUserByEmail(email, function (err, result) {
		if (result.length == 0 || err) {
			var errorInfo = "No such email in the database";
			//res.render('error.pug', {error: errorInfo});
			//res.sendStatus(202);
			//res.status(202).send(errorInfo);
			res.status(401).send(errorInfo);
		} else {
			 Userlist.matchEmailWithPwd(email, pwd, function (err, result) {
				if (result.length == 0 || err) {
					var errorInfo = "Password does not match!";
					//res.render('error.pug', {error: errorInfo});
					//res.sendStatus(204);
					//res.status(204).send(errorInfo);
					res.status(401).send(errorInfo);
				} else {
					user = result[0];
					// sign the token
					//console.log("Key is", process.env.JWT_SECRET);
					const token = jwt.sign(
						{
							//user: email,
							user: user.id,
						},
						process.env.JWT_SECRET,
						// { expiresIn: '1h' }
					);

					//send the token in a HTTP-only cookie
					res
						.cookie("token", token, {
							httpOnly: true,
							secure: true,
							sameSite: "none",
						})
						//.send();
						.send({ userId: user.id });
					//res.sendStatus(200);
					//res.json(user);
				}
			})
		}
	})
}

//create a new User with firstname, lastname, email, password
module.exports.createUser = async function (req, res) {
	//var password = md5(req.body.password);
	var newUser = new Userlist({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password
	})
	await Userlist.findUserByEmail(newUser.email, function (err, result) {
		if (result.length == 0 || err) {
			 newUser.createUser(function (err, result) {
				if (result.length == 0 || err) {
					var errorInfo = "Cannot created a new user!";
					//res.status(400).send(errorInfo);
					res.status(500).json(errorInfo);
				} else {
					//res.json({ message: 'student created!', userName: newUser.firstname });
					// sign the token
					const token = jwt.sign(
						{
							//user: newUser.email,
							user: newUser.id,
						},
						process.env.JWT_SECRET,
						//{ expiresIn: '1h' }
					);
					// send the token in a HTTP-only cookie
					res
						.cookie("token", token, {
							httpOnly: true,
							secure: true,
							sameSite: "none",
						})
						//.status(200).send();
						.status(200).send({ userId: newUser.id });
					//res.sendStatus(200);
				}
			})
		} else {
			var errorInfo = "This account has existed! Please try another email address";
			//res.send(errorInfo);
			res.status(400).json(errorInfo);
		}
	})
}

module.exports.logOut =  function (req, res) {
	res
		.cookie("token", "", {
			httpOnly: true,
			expires: new Date(0),
			secure: true,
			sameSite: "none",
		})
		//.send();
		.send({ userId: null });
}

module.exports.loggedIn =  function (req, res) {
	try {
		const token = req.cookies.token;
		if (!token) {
			//return res.json(false);
			return res.json({ userId: null });
		}
		var decoded = jwt.verify(token, process.env.JWT_SECRET);
		//console.log("decoded: ", decoded.user);	
		//res.send(true);
		res.send({ userId: decoded.user });

	} catch (err) {
		//res.json(false);
		res.json({ userId: null });
	}
}

// Search seller based on item id
module.exports.searchSelectedUser = async function (req, res) {
	id = req.query.id
	await Phonelist.searchSelected(id, function (err, result) {
		if (err) {
			console.log("Cannot find the item!")
		} else {
			sellerid = result[0].seller;
			 Userlist.searchUserID(sellerid, function (err, result) {
				if (err) {
					console.log("Cannot find the user!")
				} else {
					res.json(result);
				}
			})
		}
	})
}

//search items' reviewers batch of reviewers id
module.exports.searchReviewersById = async function (req, res) {
	id = req.body.id
	await Phonelist.searchSelected(id, function (err, result) {
		if (err || result.length === 0) {
			console.log("Cannot find the item!")
		} else {
			reviewerList = result[0].reviews;
			reviewerIds = [];
			if (reviewerList.length === 0) {
				res.status(401).send("There is no review for this phone currently!");
			} else {
				for (var i = 0; i < reviewerList.length; ++i) {
					reviewerIds.push(reviewerList[i].reviewer);
				}
				reviewerIds.sort();
				 Userlist.searchReviewerById(reviewerIds, function (err, result) {
					if (err || result.length === 0) {
						var errorInfo = "No such user in the database";
						res.status(401).send(errorInfo);
					} else {
						res.json(result);
					}
				})
			}
		}
	})
}

// Add phone id to user's cart field
//-> if user does not have any carts right now, then directly add a new one
//-> if the item id exists already, then update the quantity of it
//-> if the item id has not existed, then add a new one
module.exports.addToCart = function (req, res) {
	const { itemId, buyerid, title, price, stock, quantity } = req.body;
	var itemBought = { "itemId": itemId, "itemTitle": title, "itemPrice": price, "itemStock": stock, "quantity": quantity };
	Userlist.checkCartsExist(buyerid, function (err, result) {
		if (err || result.length === 0) {
			//add new item
			 Userlist.addCartField(buyerid, itemBought, function (err, result) {
				if (err) {
					console.log(err)
				} else {
					res.json(result);
				}
			})
		} else {
			 Userlist.searchUserCarts(buyerid, function (err, result) {
				if (err || result.length === 0) {
					var errorInfo = "There is no items added in your carts!";
					res.status(401).json(errorInfo);
				} else {
					var exists = false;
					var duplicateItem = -1;
					for (var i = 0; i < result[0].carts.length; ++i) {
						if (result[0].carts[i].itemId === itemId) {
							exists = true;
							duplicateItem = i;
							break;
						} else {
							continue;
						}
					}
					if (exists) {
						//update current one
						var newQuantity = parseInt(quantity) + parseInt(result[0].carts[duplicateItem].quantity);
						Userlist.updateItemQuantity(itemId, newQuantity, function (err, result) {
							if (err || result.length === 0) {
								var errorInfo = "This item's quantity cannot be updated";
								res.status(500).json(errorInfo);
							} else {
								var successInfo = "Updated Successfully!"
								res.json(result);
							}
						})
					} else {
						//add new item
						Userlist.addCartField(buyerid, itemBought, function (err, result) {
							if (err) {
								console.log(err)
							} else {
								res.json(result);
							}
						})
					}
				}
			})
		}
	})
}

//get current item's quantity in the specific user's carts
//-> if exists, return the number of quantities the user has
//-> if not, return 0
module.exports.currentItemQuantityInCarts = async function (req, res) {
	const { itemId, buyerid } = req.body;
	await Userlist.checkCartsExist(buyerid, function (err, result) {
		if (err || result.length === 0) {
			var errorInfo = "There is no carts for the current user!"
			res.json("0");
		} else {
			 Userlist.searchUserCarts(buyerid, function (err, result) {
				if (err) {
					var errorInfo = "(There is no items added in your carts!)";
					res.status(401).send("0");
				} else {
					var duplicateItem = -1; var exists = false;
					for (var i = 0; i < result[0].carts.length; ++i) {
						if (result[0].carts[i].itemId === itemId) {
							duplicateItem = i;
							exists = true;
							break;
						} else {
							continue;
						}
					}
					if (exists) {
						var currentQuantity = result[0].carts[duplicateItem].quantity;
						res.json(currentQuantity);
					} else {
						res.json("0");
					}

				}
			})
		}
	})
}

// Search user based on user id
module.exports.searchAUser = function (req, res) {
	id = req.query.id
	Userlist.searchUserID(id, function (err, result) {
		if (err) {
			console.log("Cannot find the user!")
		} else {
			res.json(result);
		}
	})
}

// Edit one item's quantity in user's cart
module.exports.editItem = function (req, res) {
	buyerid = req.query.buyerid
	itemid = req.query.itemid
	quantity = req.query.quantity
	Userlist.updateItem(buyerid, itemid, quantity, function (err, result) {
		if (err) {
			console.log("Cannot find the user!")
		} else {
			Userlist.searchUserID(buyerid, function (err, result) {
				if (err) {
					console.log("Cannot find the user!")
				} else {
					res.json(result);
				}
			})
		}
	})
	
}

// Delete one item in user's cart
module.exports.deleteItem = function (req, res) {
	buyerid = req.query.buyerid
	itemid = req.query.itemid
	Userlist.deletItem(buyerid, itemid, function (err, result) {
		if (err) {
			console.log("Cannot find the user!")
		} else {
			Userlist.searchUserID(buyerid, function (err, result) {
				if (err) {
					console.log("Cannot find the user!")
				} else {
					res.json(result);
				}
			})
		}
	})
}

// Delete user's cart field based on user id
module.exports.deleteCarts = function (req, res) {
	buyerid = req.query.buyerid
	Userlist.deletCarts(buyerid, function (err, result) {
		if (err) {
			console.log("Cannot find the user!")
		} else {
			Userlist.searchUserID(buyerid, function (err, result) {
				if (err) {
					console.log("Cannot find the user!")
				} else {
					res.json(result);
				}
			})
		}
	})
}