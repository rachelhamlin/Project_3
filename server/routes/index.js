var express = require('express'),
    path    = require('path'),
    router  = express.Router();

router.get('/', function(req, res) {
  if(req.cookies.current_user) {
    res.render('index');
  } else {
    res.render('login');
  }

});


module.exports = router;
