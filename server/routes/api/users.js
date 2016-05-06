var express       = require('express');
var usersRouter   = express.Router();

var User          = require('../../models/user');

var passport = require("../../lib/passportStrategy.js");

usersRouter.post('/', function(req, res){
  User.create( req.body.user, function(error, dbUser){
    if(error){
      // Throw status
    } else {
      res.json(dbUser);
    }
  });
});

// Routes about this line are not protected
usersRouter.use(passport.authenticate('jwt', {session: false}));

usersRouter.get('/', function(req, res){});

module.exports = usersRouter;
