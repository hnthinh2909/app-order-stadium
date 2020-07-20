require('dotenv').config();
const express = require("express");

let countTypeCaptcha = 1;

const shortid = require('shortid');
const Transaction = require("../models/transaction.models.js");
const mongoose = require("mongoose");

const nodemailer = require('nodemailer');

module.exports.index = (req, res) => {

	res.render("stadium/index");
}

module.exports.order = (req, res) => {
	const user  = res.locals.user;
	if(!user) {
		return res.render("stadium/order");
	}
	res.render("stadium/order-logined");
}

module.exports.orderPost = async (req, res) => {

	const user  = res.locals.user;
	if(user) {
		const transaction = new Transaction({
			_id:  mongoose.Types.ObjectId(), // String is shorthand for {type: String}
		    name: user.name,
		    phone:   user.phone,
		    isComplete: false,
		    rangePeople: req.body.rangePeople,
		    time: {
		      from: req.body.from,
		      to: req.body.to
		    },
		    date: {
		      day: req.body.day,
		      month: req.body.month
		    }
		})
		transaction.save();
		return res.redirect("/stadium")
	} 

	if(!user) { 
		const transaction = new Transaction({
			_id:  mongoose.Types.ObjectId(), // String is shorthand for {type: String}
		    name: req.body.name,
		    phone:   req.body.phone,
		    email:   req.body.email,
		    isComplete: false,
		    rangePeople: req.body.rangePeople,
		    time: {
		      from: req.body.from,
		      to: req.body.to
		    },
		    date: {
		      day: req.body.day,
		      month: req.body.month
		    },
		    idSubmit: shortid.generate(),
		})
		transaction.save();

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
		  to: transaction.email,
		  subject: 'Submit Order',
		  text: 'Copy this captcha to submit your order : <b>' + transaction.idSubmit + '</b>',
		};
		await transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			}
		});

		return res.render("stadium/submit", {
			transaction
		})
	}

	res.redirect("/stadium");
}

module.exports.submit = (req, res) => {
	res.render("stadium/submit");
}

module.exports.submitPost = async (req, res) => {
	const transaction = await Transaction.findOne({_id: req.body.id});
	const captcha = req.body.captcha;

	if(countTypeCaptcha > 3) {
		await Transaction.deleteOne({_id: transaction.id});
		res.redirect("/stadium")
		// res.render("stadium/order", {
		// 	alert: "You type wrong captcha 3 times. Please re-order!"
		// });
	}

	if(countTypeCaptcha <= 3) {
		if(transaction.idSubmit !== captcha) {
			countTypeCaptcha++;
			res.redirect("/stadium")
			// res.render("stadium/submit", {
			// 	transaction,
			// 	error: "You captcha is wrong! Retype!"
			// })
		}

		if(transaction.idSubmit == captcha) {
			res.redirect("/stadium")
		}
	}
	res.redirect("/stadium");
}