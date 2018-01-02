var express = require('express');
var router = express.Router();
var {Category} = require("../models/category.js");

router.get("/", (req, res) => {
	Category.find({}, (err, categories) => {
		if(err)
			throw err;
		res.render("category", {
			categories: categories 
		});
	});
});

router.get("/create", (req, res) => {
	res.render("create-category");
});

router.post("/create", (req, res) => {
	let category = {
		title: req.body.title
	};
	Category.create(category, (err, savedCategory) => {
		if(err)
			throw err;
		return res.redirect("/categories")
	});
});

module.exports = router;