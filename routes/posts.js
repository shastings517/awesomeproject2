var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");

router.use(loginMiddleware);

// need to prefix these routes with the parent route
// router.use('/:author_id/books', authors);

/********* POST ROUTES *********/

//INDEX
router.get('/', function(req,res) {
  db.Post.find({}).populate('author', 'username').exec(function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      if(req.session.id == null){
        res.render('posts/index', {posts: posts, currentuser: ""});
      } else {
        db.User.findById(req.session.id, function(err,user){
          res.render('posts/index', {posts: posts, currentuser: user});
        });
      }
    }
  });
});

//NEW POST
router.get('/new', routeMiddleware.ensureLoggedIn, function(req,res) {
  res.render("posts/new", {author_id:req.session.id});
});

//CREATE POST
router.post('/', function(req,res) {
  db.Post.create(req.body.post, function(err, post){

    if(!post.media) {
      post.media = "http://farm6.staticflickr.com/5241/5294677555_7efa8154db.jpg";
      post.save();
    }

    if (err) {
      console.log(err);
      res.render('/posts/new');
    } else {
      res.redirect('/');
    }
  });
});

//SHOW POST
router.get('/:id', function(req,res){
  db.Post.findById(req.params.id).populate('comments').exec(
    function(err,post){
      res.render('posts/show', {post: post});
    });
});

//EDIT POST
router.get('/:id/edit',routeMiddleware.ensureCorrectUserForPost, function(req,res){
  db.Post.findById(req.params.id, function(err,post){
    if (err) {
      console.log(err);
    }
    res.render('posts/edit', {post: post});
  });
});

//UPDATE POST
router.put('/:id',routeMiddleware.ensureCorrectUserForPost, function(req,res){
  var show_page = "/posts/" + req.params.id;
  db.Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,post){
    if (err) {
      console.log(err);
      res.render('posts/edit');
    } else {
    res.redirect(show_page);
    }
  });
});

//DESTROY POST
router.delete('/:id',routeMiddleware.ensureCorrectUserForPost, function(req,res){
  db.Post.findById(req.params.id, function(err, post){
    if (err) {
      console.log(err);
      res.render('posts/show');
    } else {
      post.remove();
      res.redirect('/');
    }
  });
});

module.exports = router;