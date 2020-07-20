const express = require("express");

const User = require("../models/user.models.js");
const mongoose = require("mongoose");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const nodemailer = require('nodemailer');

//route get signin
module.exports.signIn = (req, res) => {
	res.render("login/signin");
}

module.exports.signInPost = async (req, res) => {
	const user = await User.findOne({email: req.body.email});

	const compare = bcrypt.compareSync(req.body.password, user.password);
	console.log(compare);
	if(!user) {
		res.render("login/signin", {
			error: "Some thing with your account!"
		});
	}

	if(!compare) {
		res.render("login/signin", {
			error: "Some thing with your account!"
		})
	}
	// check value req.body
	res.cookie("userId", user._id, {expires: new Date(Date.now() + 900000), signed: true});
	res.redirect("/");
}

//route get signup
module.exports.signUp = (req, res) => {
	res.render("login/signup");
}

module.exports.signUpPost = (req, res) => {
	const hash = bcrypt.hashSync(req.body.password, saltRounds);
	let user = new User({
		_id:  new mongoose.Types.ObjectId() ,
	    name: req.body.name,
	    phone:   req.body.phone,
	    password: hash,
	    isAdmin: true,
	    email: req.body.email,
	    address: req.body.adress
	});
	user.save();
	// push value req.body
	res.redirect("/auth/signin");
}


//route reset password with objectid
module.exports.resetPwd = (req, res) => {
	const id = req.params.id || req.body.id;
	// update value req.body
	res.render("login/forgetpwd", {
		id: id
	});
}

module.exports.resetPwdPost = async (req, res) => {
	const hash = bcrypt.hashSync(req.body.password, saltRounds);

	let pwd = req.body.password;
	let confirmpwd = req.body.confirmpassword;

	if(pwd !== confirmpwd) {
		res.render("login/forgetpwd/", {
			id: req.body.id,
			error: "Your password is different. Retype!!"
		})
	}
	else {
		await User.findOneAndUpdate({_id: req.body.id}, {$set: {password: hash}});
		// update value req.body
		res.redirect("/");
	}
	
}

module.exports.indexForget = (req, res) => {
	res.render("login/indexforgetpwd");
}

module.exports.indexForgetPost = async (req, res) => {
	const user = await User.findOne({email: req.body.email});
	if(!user) {
		res.redirect("back");
	}
	if(user) {
		var transporter = nodemailer.createTransport({
		  host: 'smtp.gmail.com',
		  port: 465,
		  secure:true,
		  auth: {
		    user: process.env.GOOGLE_USER,
		    pass: process.env.GOOGLE_PWD
		  }
		});

		var mailOptions = {
		  from: 'app-order-stadium@gmail.com',
		  to: user.email,
		  subject: 'Reset Password',
		  text: 'Click this link to reset password: https://app-order-stadium.herokuapp.com/auth/resetpassword/' + user.id,
		};
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			}
		});
		res.render("login/signin")
	}
}


module.exports.logOut = (req, res) => {
	res.cookie("userId", {maxAge: 0});
	res.render("layouts/index");
}