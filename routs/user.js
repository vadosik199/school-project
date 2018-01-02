var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
var {User} = require("../models/user.js");


router.get("/", (req, res) => {
	User.find({}, (err, users) => {
		if(err)
			throw err;
		res.render("users", {
			users: users,
			currentUser: req.session.user
		});
	});
});

router.get("/create", (req, res) => {
	res.render("registration");
});

router.post("/create", (req, res) => {
	let user = {
		name: req.body.name,
		surname: req.body.surname,
		email: req.body.email,
		password: req.body.password
	};
	bcrypt.hash(user.password, 10, (err, hash) => {
		if(err)
			throw err;
		user.password = hash;
		User.create(user, (err, savedUser) => {
			if(err)
				throw err;
			req.session.user = savedUser;
			return res.redirect("/users");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", (req, res) => {
	User.authenticate(req.body.email, req.body.password, function (error, user) {
      	if (error || !user) {
        	var err = new Error('Wrong email or password.');
        	err.status = 401;
        	throw err;
      	} 
      	else {
        	req.session.user = user;
        	return res.redirect('/users');
      	}
    });
});

router.get('/logout', function (req, res) {
  	if (req.session) {
    	req.session.destroy(function (err) {
      		if (err) {
        		throw err;
      		} 
      		else {
        		return res.redirect('/');
      		}
    	});
  	}
});

module.exports = router;