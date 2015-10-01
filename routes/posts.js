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
                  post.score = 100;
                  console.log(JSON.parse(body).docSentiment.score);
                  post.lowSentiment = JSON.parse(body).docSentiment.score;
                  console.log(post.date);
                  user.posts.push(post);
                  console.log(post);
                  post.user = user._id;
                  //assign point values to post schema variables
                  if(post.sleep >= 8){
                    post.score -= 10;
                  }
                  else if(post.sleep >= 5){
                    post.score -= 15;
                  }
                  else if(post.sleep >= 1){
                    post.score -= 20;
                  }
                  else if(post.sleep === 0){
                    post.score -= 25;
                  }
                  console.log(post.score);
                  if(post.meditate === "no"){
                    post.score -= 15;
                  }
                  console.log(post.score);
                  if(post.diet === "poor"){
                    post.score -= 25;
                  }
                  else if(post.diet === "ok"){
                    post.score -= 20;
                  }
                  else if(post.diet === "fair"){
                    post.score -= 15;
                  }
                  else if(post.diet === "good"){
                    post.score -= 10;
                  }
                  console.log(post.score);
                  if(post.improvements === "" || post.improvements === "none" || post.improvements === "nothing" || post.improvements === "no"){
                    post.score -= 10;
                  }

                  post.score += (post.lowSentiment + post.highSentiment) * 9;
                  post.score = (post.score).toFixed(2);
                  
                  post.save(function(err,post){
                    user.save(function(err,user){
                      res.redirect("/posts");
                    });
                  });
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
  console.log("THIS IS WHATS COMING IN ", req.body)
  var show_page = "/posts/" + req.params.id;
  db.Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,post){
    if (err) {
      console.log(err);
      res.render('posts/edit');
    } else {
      db.User.findById(req.session.id, function(err, user) {
        request("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?apikey=" + process.env.ALCHEMY_API_KEY + "&outputMode=json&text=" + encodeURIComponent(req.body.post.high),
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log(JSON.parse(body).docSentiment.score);
              post.highSentiment = JSON.parse(body).docSentiment.score;

              request("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?apikey=" + process.env.ALCHEMY_API_KEY + "&outputMode=json&text=" + encodeURIComponent(req.body.post.low),
              function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  post.score = 100;
                  console.log(JSON.parse(body).docSentiment.score);
                  post.lowSentiment = JSON.parse(body).docSentiment.score;
                  console.log(post.date);
                  user.posts.push(post);
                  console.log(post);
                  post.user = user._id;
                  //assign point values to post schema variables
                  if(post.sleep >= 8){
                    post.score -= 10;
                  }
                  else if(post.sleep >= 5){
                    post.score -= 15;
                  }
                  else if(post.sleep >= 1){
                    post.score -= 20;
                  }
                  else if(post.sleep === 0){
                    post.score -= 25;
                  }
                  console.log(post.score);
                  if(post.meditate === "no"){
                    post.score -= 15;
                  }
                  console.log(post.score);
                  if(post.diet === "poor"){
                    post.score -= 25;
                  }
                  else if(post.diet === "ok"){
                    post.score -= 20;
                  }
                  else if(post.diet === "fair"){
                    post.score -= 15;
                  }
                  else if(post.diet === "good"){
                    post.score -= 10;
                  }
                  console.log(post.score);
                  if(post.improvements === "" || post.improvements === "none" || post.improvements === "nothing" || post.improvements === "no"){
                    post.score -= 10;
                  }

                  post.score += (post.lowSentiment + post.highSentiment) * 9;
                  post.score = (post.score).toFixed(2);
                  
                  post.save();
                  user.save();
                  res.redirect(show_page);
                  // res.redirect("/posts");
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