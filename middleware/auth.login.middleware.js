const User = require("../models/user.models.js");
const mongoose = require("mongoose");

module.exports.requireSignIn = async (req, res, next) => {
	if(req.signedCookies.userId) {
		let user = await User.findOne({_id: req.signedCookies.userId});
		res.locals.user = user;
	}
	next();
}

