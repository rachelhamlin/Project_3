var express       = require('express');
var path          = require('path');
var favoritesRouter   = express.Router();
var jwt           = require('jsonwebtoken');

var User          = require('../../models/user');

// Experimental Fav stuff
var Favorite      = require('../../models/favorite');
// ----------------------

var passport = require("../../lib/passportStrategy.js");


favoritesRouter.delete('/:place_id', function(req, res) {
  var cookiesUser = JSON.parse(req.cookies.current_user);
  var query = { username: cookiesUser.username };

  User.update(query, {$pull: {"favorites": _id}}, function(error,data){
    if(error){
      console.log(error);
    } else {
      res.json(data);
    }
  })
});
