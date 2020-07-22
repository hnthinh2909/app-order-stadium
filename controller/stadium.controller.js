const express = require("express");

const Stadium = require("../models/stadium.model.js");
const mongoose = require("mongoose");

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