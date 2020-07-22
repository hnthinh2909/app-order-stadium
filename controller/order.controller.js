require('dotenv').config();
const express = require("express");

let countTypeCaptcha = 1;

const shortid = require('shortid');
const Transaction = require("../models/transaction.models.js");
const Stadium = require("../models/stadium.model.js");
const mongoose = require("mongoose");

const nodemailer = require('nodemailer');

module.exports.index = async (req, res) => {
	let perPage = 10;
    let page = parseInt(req.query.page) || 1;

	let stadiums = await Stadium.find({}).skip((perPage * page) - perPage).limit(perPage);
	let countOfStadium = await Stadium.countDocuments();

	let pageOfPagination = Math.ceil( countOfStadium / perPage);
	let pages = [];

	for(let i = 1; i <= pageOfPagination; i++) {
		pages.push(i);
	}
	
	res.render("stadium/index", {
		stadiums,
		pages,
		countOfStadium
	});
}

module.exports.order = (req, res) => {
	const user  = res.locals.user;
	const idStadium =req.params.id;
	if(!user) {
		return res.render("stadium/order", {
			idStadium
		});
	}
	res.render("stadium/order-logined", {
		idStadium
	});
}

module.exports.orderPost = async (req, res) => {
	console.log(req.body.id);
	let stadium = await Stadium.findOne({_id: req.body.id});
	const user  = res.locals.user;
	if(user) {
		const transaction = new Transaction({
			_id:  mongoose.Types.ObjectId(), // String is shorthand for {type: String}
		    name: user.name,
		    phone:   user.phone,
		    stadiumName: stadium.name,
		    stadiumAddress: stadium.address,
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
		console.log(transaction);
		transaction.save();
		return res.redirect("/stadium")
	} 

	if(!user) { 
		const transaction = new Transaction({
			_id:  mongoose.Types.ObjectId(), // String is shorthand for {type: String}
		    name: req.body.name,
		    phone:   req.body.phone,
		    stadiumName: stadium.name,
		    stadiumAddress: stadium.address,
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
		  text: 'This is email is auto, don\'t reply!',
		  html: '<p>Copy this captcha to submit your order :<b>' + transaction.idSubmit+ '</b><p>'
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

module.exports.create = (req, res) => {
	res.render("stadium/create");
}

module.exports.createPost = (req, res) => {
  	
 	let q = (req.body.map).toLowerCase();
 	let valueq = q.split(" ").join("%20");
 	let map = valueq.concat(req.body.city)

 	var stadium = new Stadium({
	    _id:  mongoose.Types.ObjectId(), // String is shorthand for {type: String}
	    name: req.body.name,
	    rangePeople: req.body.rangePeople,
	    address: req.body.address,
	    qSearch: map 
  	});

 	console.log(stadium);
  	stadium.save();
  	res.redirect("/stadium");
}