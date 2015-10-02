var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");


router.get('/login', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/login');
});

router.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/posts");
    } else {
      console.log(err);
      res.render('users/signup', {err:err});
    }
  });
});

router.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/signup');
});

router.post('/signup', function(req,res){
   db.User.create(req.body.user, function(err, user){
    if (user) {
      console.log(user);
      req.login(user);
      res.redirect('/posts');
    } else {
      console.log(err);
      res.render('errors/404');
    }
  });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;