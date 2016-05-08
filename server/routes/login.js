var express       = require('express'),
    path          = require('path'),
    loginRouter   = express.Router();

var User          = require('../models/user');

loginRouter.get('/', function(req, res){
  res.render('login');
});

loginRouter.post('/', function(req, res){
  var newUser = User({
    username:   req.body.name,
    email:      req.body.email,
    password:   req.body.password,
    firstName:  req.body.firstName,
    lastName:   req.body.lastName
  });

  newUser.save(function(error, dbUser){
    if(error){
      console.log("Failed saving User: " + error);
      res.status(501).json(error);
    } else {
      res.status(201).json(dbUser);
    }
  });
});


module.exports = loginRouter;
