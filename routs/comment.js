var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var {Comment} = require("../models/comment.js");
var {Article} = require("../models/article.js");

router.post("/add", (req, res) => {
	Article.find({_id: req.body.postId}).exec((err, article) => {
		if(err)
			throw err;
		let comment = {
			text: req.body.usercomment,
			date: Date.now(),
			post: article[0]._id
		};
		if(req.session.user) {
			comment.author = req.session.user._id
		}
		else {
			comment.authorName = req.body.username;
			comment.authorEmail = req.body.email;
		}
		Comment.create(comment, (err, saved) => {
			if(err)
				throw err;
			console.log(saved);
			Article.findByIdAndUpdate(req.body.postId, {$push: {comments: saved._id}}, (err, result) => {
				if(err)
					throw err;
				res.redirect("/posts/id/" + req.body.postId);
			});
		});
	});
	/*Category.create(category, (err, savedCategory) => {
		if(err)
			throw err;
		return res.redirect("/categories")
	});*/
});

module.exports = router;