var express       = require('express'),
    path          = require('path'),
    profileRouter   = express.Router();

var User          = require('../models/user');

profileRouter.get('/', function(req, res){
  var user = {};
  if(req.cookies.current_user) {

    user = JSON.parse(req.cookies.current_user);
  }
  console.log(user);
  res.render('profile', { user: user });
});

module.exports = profileRouter;
