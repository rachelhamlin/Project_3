var express       = require('express');
var path          = require('path');
var usersRouter   = express.Router();
var jwt           = require('jsonwebtoken');

var User          = require('../../models/user');

// Experimental Fav stuff
var Favorite      = require('../../models/favorite');
// ----------------------

var passport = require("../../lib/passportStrategy.js");

usersRouter.post('/', function(req, res){
  var newUser = User({
    username:   req.body.username,
    email:      req.body.email,
    password:   req.body.password,
    firstName:  req.body.firstName,
    lastName:   req.body.lastName,
    // Experimental Fav stuff
    favorites:  []
  });

// Experimental Fav stuff
  var newFavorite = Favorite({
    name: "General Assembly",
    place_id: "ChIJT3jEwaNZwokRS-hniJsDhDg",
    type: "school",
    lat: 40.73991760000001,
    lng: -73.990166,
    address: "4, 10 E 21st St, New York, NY 10010, United States"
  });

  newUser.favorites.push(newFavorite);

// --------------------------

  newUser.save(function(error, dbUser){
    if(error){
      console.log("Failed saving User: " + error);
      res.status(501).json(error);
    } else {
      var token = jwt.sign(dbUser, process.env.JWT_SECRET, {
        expiresIn: 1440
      });
      res.json({token: token, currentUser: dbUser});

      }
  })
});

// Routes about this line are not protected
usersRouter.use(passport.authenticate('jwt', {session: false}));

usersRouter.get('/', function(req, res){});

module.exports = usersRouter;
