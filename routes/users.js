var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
// var loginMiddleware = require("../middleware/loginHelper");

router.get('/users/:id', function(req,res){
  db.User.findById(req.session.id).populate('posts').exec(function (err, user){
    if (err) {
      console.log(err);
    }
    else {
      console.log(user.posts.length);
      res.render('users/show');
    }
  });
});

module.exports = router;



// app.get('/entries/:id', function (req, res){
//   db.Entry.findById(req.params.id, function (err, entry){
//     err ? res.render('404') : res.render('show', {entry: entry});
//   });
// });