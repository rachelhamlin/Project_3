var express       = require('express');
var path          = require('path');
var usersRouter   = express.Router();

var User          = require('../../models/user');

var passport = require("../../lib/passportStrategy.js");

usersRouter.post('/', function(req, res){
  var newUser = User({
    username:   req.body.username,
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
      // res.status(201).json(dbUser);
      console.log(dbUser);
      // res.render('profile', {user: dbUser});
      // res.redirect('http://localhost:8080');
      res.login(dbUser, function(error){
        if(!error){
          res.redirect('http://localhost:8080');
        }
      })
    }
  })
  // User.create( req.body.user, function(error, dbUser){
  //   if(error){
  //     // Throw status
  //   } else {
  //     res.json(dbUser);
  //   }
  // });
});

// Routes about this line are not protected
usersRouter.use(passport.authenticate('jwt', {session: false}));

usersRouter.get('/', function(req, res){});

module.exports = usersRouter;
