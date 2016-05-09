var express       = require('express'),
    path          = require('path'),
    profileRouter   = express.Router();

var User          = require('../models/user');

profileRouter.get('/:id', function(req, res){
  var id = req.params.id;
  User.findById(id, function(error, response){
    console.log(response);
    if(error){
      res.status(404).end();
    } else {
      res.render('profile');
    }
  })
});

module.exports = profileRouter;
