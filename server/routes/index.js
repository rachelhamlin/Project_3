var express = require('express'),
    path    = require('path'),
    router  = express.Router();

var User    = require('../models/user');

var passport = require("../lib/passportStrategy");

router.get('/', function(req, res) {
  var currentUser = {};
  if(req.cookies.current_user) {
    currentUser = JSON.parse(req.cookies.current_user);
    var query = { username: currentUser.username };
    User.findOne(query, function(error, user){
      // theUser = user;
      res.render('index', { currentUser: user });
    });
  } else {
    res.render('login');
  }

});


module.exports = router;
