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

});
