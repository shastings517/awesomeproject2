var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");

router.use(loginMiddleware);

router.get('/users/index', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/index');
});

module.exports = router;