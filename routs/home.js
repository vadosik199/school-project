var express = require('express');
var router = express.Router();
var {Article} = require("../models/article.js");

router.get("/", (req, res) => {
	Article.find({})
		.populate("author")
		.populate("category")
		.sort({created: -1})
		.limit(3)
		.exec((err, news) => {
		if(err)
			throw err;
		console.log(news);
		res.render("news", {
			news: news,
			title: "Головна сторінка"
		});
	});
});
module.exports = router;