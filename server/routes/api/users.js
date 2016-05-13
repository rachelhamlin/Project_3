var express       = require('express');
var path          = require('path');
var usersRouter   = express.Router();
var jwt           = require('jsonwebtoken');

// Require models
var User          = require('../../models/user');
var Favorite      = require('../../models/favorite');

var passport      = require("../../lib/passportStrategy.js");

usersRouter.post('/', function(req, res){
  var newUser = User({
    username:   req.body.username,
    email:      req.body.email,
    password:   req.body.password,
    firstName:  req.body.firstName,
    lastName:   req.body.lastName,
    favorites:  []
  });

// Adding a few favorites manually for development purposes
  var newFavorite = Favorite({
    name: "General Assembly",
    place_id: "ChIJT3jEwaNZwokRS-hniJsDhDg",
    type: "school",
    lat: 40.7400914,
    lng: -73.9908452,
    address: "4, 10 E 21st St, New York, NY 10010, United States"
  });

  var secondFavorite = Favorite({
    name: "Toby's Estate Coffee",
    place_id: "ChIJHy0ZlqNZwokRABxBCQR_37o",
    type: "cafe",
    lat: 40.73991760000001,
    lng: -73.990166,
    address: "160 5th Ave, New York, NY 10010, United States"
  });

  var thirdFavorite = Favorite({
    name: "BaoBurg",
    place_id: "ChIJRZT7911ZwokRnsLwhRgjn7c",
    type: "restaurant",
    lat: 40.71783,
    lng: -73.9596111,
    address: "126 North 6th Street, Brooklyn"
  });

  newUser.favorites.push(newFavorite, secondFavorite, thirdFavorite);
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

//  *** Routes below this line are protected ***
//  *** H4CK3R$ NOT ALLOWED PAST THIS POINT ***
usersRouter.use(passport.authenticate('jwt', {session: false}));

usersRouter.delete('/', function(req, res){
  var cookiesUser = JSON.parse(req.cookies.current_user);
  var query = { username: cookiesUser.username };

  User.remove(query, function(error, user){
    if (error){
      console.log(error);
    } else {
      console.log('deleted');
      // res.redirect('index');
      res.json(user);
    }
  })
})

usersRouter.put('/', function(req, res){

  var newFavorite = Favorite({
    name: req.body.name,
    place_id: req.body.place_id,
    type: req.body.type,
    address: req.body.address,
    lat: req.body.lat,
    lng: req.body.lng,
    notes: req.body.notes
  });

  var cookiesUser = JSON.parse(req.cookies.current_user);
  var query = { username: cookiesUser.username };

  // Update User based on query with new Favorite
  User.update(query, {$push: {"favorites": newFavorite}}, function(error, user){
    if(error){
      console.log(error);
    } else {
      res.json(newFavorite);
    }
  })
});

usersRouter.get('/:username', function(req, res){
  var username = req.params.username;
  var query = { username: username }
  User.findOne(query, function(error, user){
    res.json(user);
  })
});

module.exports = usersRouter;
