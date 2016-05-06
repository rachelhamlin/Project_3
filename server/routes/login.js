var express       = require('express'),
    path          = require('path'),
    loginRouter   = express.Router();

var User          = require('../../models/user');

loginRouter.get('/', function(req, res){
  res.render('login');
});

loginRouter.post('/', function(req, res){
  var newUser =
});

// resourceRouter.post(“/“, function(req, res){
// 				var newResource = Resource({
// 					name: req.body.name,
// 					age: req.body.age,
// 					color: req.body.color
// 				});
//
// 				newOwl.save(function(error, resource){
// 					if(error){
// 						console.log(“FAILURE SAVING RESOURCE: “ + error);
// 						res.status(501).json(error);
// 					}
// 					res.status(201).json(owl);
// 				});
// 			});


module.exports = loginRouter;
