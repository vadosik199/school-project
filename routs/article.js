var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var {Article} = require("../models/article.js");
var {Category} = require("../models/category.js");
var mv = require("mv");

router.get("/", (req, res) => {
	var postsQuery = null;
    if(req.query.category != undefined) {
        postsQuery = Article.find({category: req.query.category});
    }
    else {
        postsQuery = Article.find();
    }
    if(req.query.search != undefined) {
        postsQuery = postsQuery.where({
            title: {
                $regex: `${req.query.search}`,
                $options: 'i'
            }
        });
    }
    postsQuery
        .populate("author")
        .populate("category")
        .sort({created: -1})
        .exec((err, news) => {
		if(err)
			throw err;
        Article.find({})
            .sort({created: -1})
            .limit(3)
            .exec((err, latestPosts) => {
                if(err)
                    throw err;
                Category.find({}).exec((err,categories) => {
                    if(err)
                        throw err;
                    res.render("posts-blog", {
                        title: "Новини",
                        posts: news,
                        latestPosts: latestPosts,
                        categories: categories
                    });
                });
            });
	});
});

router.get("/id/:id", (req, res) => {
    Article.find({_id: req.params.id})
        .populate("author")
        .populate("category")
        .exec((err, article)=> {
            if(err)
                throw err;
            Article.find({})
                .sort({created: -1})
                .limit(3)
                .exec((err, latestPosts) => {
                    if(err)
                        throw err;
                    Category.find({}).exec((err,categories) => {
                        if(err)
                            throw err;
                        console.log(article);
                        Article.findOne({created: {$lt: article.created}})
                            .sort({created: -1})
                            .exec((err, previous) => {
                                if(err)
                                    throw err;
                                console.log(previous);
                                Article.findOne({_id: {$gt: article._id}})
                                    .sort({_id: 1 })
                                    .exec((err, next) => {
                                        if(err)
                                            throw err;
                                        console.log(next);
                                        res.render("article-details", {
                                            title: article.title,
                                            post: article[0],
                                            latestPosts: latestPosts,
                                            categories: categories,
                                            previous: previous === undefined ? null : previous,
                                            next: next === undefined ? null : next,
                                        });
                                    });
                            });
                    });
            });
    });
});

router.get("/create", (req, res) => {
	Category.find({}, (err, categories) => {
		if(err)
			throw err;
        console.log(categories);
		res.render("create-news", {
			categories: categories
		});
	});
});

router.post("/create", (req, res) => {
	let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    	if(err)
    		throw err;
    	console.log(fields);
      	let oldpath = files.image.path;
      	let newFileName = Date.now() +files.image.name;
      	let newpath = appDir + '/public/img/news/' + newFileName;
        mv(oldpath, newpath, (err) => {
            if (err) 
                throw err;
            let news = {
                title: fields.title,
                text: fields.text,
                images: [newFileName],
                category: fields.category,
                author: req.session.user._id,
                created: Date.now()
            };
            Article.create(news, (err, created) => {
                if(err)
                    throw err;
                return res.redirect("/users");
            });
        });
      	//fs.rename(oldpath, newpath, function (err) {
        	
      	//});
    });
});

module.exports = router;