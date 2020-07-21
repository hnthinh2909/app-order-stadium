const express = require("express");

const Transaction = require("../models/transaction.models.js");

module.exports.index = async (req, res) => {
	const transaction = await Transaction.find({});
	res.render("transaction/index", {
		transactions: transaction
	});
}

module.exports.edit = async (req, res) => {
	const id = req.params.id;
	const transaction = await Transaction.findOne({_id: id});
	res.render("transaction/edit", {
		transaction: transaction
	});
}

module.exports.editPost = async (req, res) => {
	let complete = Boolean(req.body.isComplete);
	await Transaction.findOneAndUpdate({_id: req.body.id}, {$set: {isComplete: complete}});
	res.redirect("/transaction");
}

module.exports.delete = async (req, res) => {
	await Transaction.deleteOne({_id: req.params.id});
	res.redirect("back");
}