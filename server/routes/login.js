var express       = require('express'),
    path          = require('path'),
    loginRouter   = express.Router();

var User          = require('../models/user');

loginRouter.get('/', function(req, res){
  res.render('login');
});


module.exports = loginRouter;
