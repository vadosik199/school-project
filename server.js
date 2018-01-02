var express = require("express");
var Database = require("./db.js");
var app = new express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var User = require("./models/user.js");

app.set("views", "./templates");
app.set("view engine", "pug");

app.use(session({
 	secret: 'work hard',
  	resave: true,
  	saveUninitialized: false,
  	store: new MongoStore({
    	mongooseConnection: mongoose.connection
  	})
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next){
	res.locals.user = null;
	if(req.session.user) {
		res.locals.user = req.session.user;
	}
  	next();
});

app.use('/', express.static(__dirname + '/public'));
app.use('/', require('./routs/home'));
app.use('/posts', require('./routs/article'));
app.use('/users', require('./routs/user'));
app.use('/categories', require('./routs/category'));

var port = process.env.PORT || 5000;
Database.connect("mongodb://vadosik9:vadim1976111SZ@ds046047.mlab.com:46047/school", (err) => {
	if(err)
		throw err;
	app.listen(port, () => {
		console.log("App started");
	});
});
