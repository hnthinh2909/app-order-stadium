const express = require("express");

const User = require("../models/user.models.js");

module.exports.index =  async (req, res) => {
	let users = await User.find();
	res.render("user/index", {
		users: users
	})
}

module.exports.profile = async (req, res) => {
	let id = req.signedCookies.userId;
	let user = await User.findOne({_id: id});
	res.render("user/profile", {
		user: user
	})
}

module.exports.edit = async (req, res) => {
	let id = req.signedCookies.userId;
	let user = await User.findOne({_id: id});
	res.render("user/edit", {
		user: user
	})
}

module.exports.editPost = async (req, res) => {
	let id = req.signedCookies.userId;
	await User.findOneAndUpdate({_id: id}, {$set: {
		name: req.body.name,
		email: req.body.email,
		address: req.body.address,
		phone: req.body.phone
	}});
	res.redirect("/user/profile")
}
