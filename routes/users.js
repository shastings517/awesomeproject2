var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");

// router.use(loginMiddleware);

router.get('/users/show', function(req,res){
  res.render('users/show');
});

module.exports = router;