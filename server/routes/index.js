var express = require('express'),
    path    = require('path'),
    router  = express.Router();

var User    = require('../models/user');
// Accessing User models in our Index router... IS THIS GHETTO CODE???
var passport = require("../lib/passportStrategy");

router.get('/', function(req, res) {
  var currentUser = {};
  var theUser = {};
  // if(req.user){
  //   res.render('index', { current: req.user });
  // } else {
  //   res.render("login");
  // }

  if(req.cookies.current_user) {
    currentUser = JSON.parse(req.cookies.current_user);
    var query = { username: currentUser.username };
    User.findOne(query, function(error, user){
      theUser = user;
      res.render('index', { currentUser: theUser });
    });
    // res.render('index', { currentUser: theUser });
  } else {
    res.render('login');
  }

});


module.exports = router;
