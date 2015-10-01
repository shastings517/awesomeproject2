var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");

router.use(loginMiddleware);


/********* POST ROUTES *********/

//INDEX
router.get('/', function(req,res) {
    if(req.session.id === null){
      res.redirect('/signup');
    } 
    else {
      db.User.findById(req.session.id).populate('posts').exec(function(err, user){
        if (err) {
          console.log(err);
        }
        else {
          console.log(user);
          res.render('posts/index', {posts: user.posts, currentuser: user});
        }
      });
    }
});

//NEW POST
router.get('/new', routeMiddleware.ensureLoggedIn, function(req,res) {
  res.render("posts/new", {author_id: req.session.id});
});

//CREATE POST
router.post('/', function(req,res) {
  db.Post.create(req.body.post, function(err, post){
    if (err) {
      console.log(err);
      res.render('/posts/new');
    } 
    else {
      db.User.findById(req.session.id, function(err, user) {
        request("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?apikey=" + process.env.ALCHEMY_API_KEY + "&outputMode=json&text=" + encodeURIComponent(req.body.post.high),
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log(JSON.parse(body).docSentiment.score);
              post.highSentiment = JSON.parse(body).docSentiment.score;

              request("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?apikey=" + process.env.ALCHEMY_API_KEY + "&outputMode=json&text=" + encodeURIComponent(req.body.post.low),
              function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  console.log(JSON.parse(body).docSentiment.score);
                  post.lowSentiment = JSON.parse(body).docSentiment.score;
                  post.score = post.lowSentiment + post.highSentiment;
                  user.posts.push(post);
                  console.log(post);
                  post.user = user._id;
                  post.save();
                  user.save();
                  res.redirect("/posts");
                }
            });
          }
          else {
              console.log("uhhh we fucked up...", error, response);
          }
        });

        
    });
    }
  });
});

router.get('/', function(req, res){
  console.log(req.user.accessToken);
  
  res.render('user/index', { user: req.user });
});

//SHOW POST
router.get('/:id', function(req,res){
  db.Post.findById(req.params.id).populate('comments').exec(
    function(err,post){
      res.render('posts/show', {post: post});
    });
});

//EDIT POST
router.get('/:id/edit', function(req,res){
  db.Post.findById(req.params.id, function(err,post){
    if (err) {
      console.log(err);
    }
    res.render('posts/edit', {post: post});
  });
});

//UPDATE POST
router.put('/:id', function(req,res){
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
router.delete('/:id', function(req,res){
  db.Post.findByIdAndRemove(req.params.id, function(err, post){
    if (err) {
      console.log(err);
      res.render('posts/show');
    } else {
      res.redirect('/posts');
    }
  });
});

module.exports = router;