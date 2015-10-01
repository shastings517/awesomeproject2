require('dotenv').load();
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    session = require("cookie-session"),
    db = require('./models'),
    loginMiddleware = require("./middleware/loginHelper"),
    routeMiddleware = require("./middleware/routeHelper"),
    usersRoutes = require("./routes/users"),
    postsRoutes = require("./routes/posts"),
    // commentsRoutes = require("./routes/comments"),
    accessRoutes = require("./routes/access");
    request = require('request');

app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  maxAge: 3600000,
  secret: process.env.COOKIE_SECRET,
  name: "double chocochip"
}));


// ROUTES
app.use("/",usersRoutes);
app.use("/posts",postsRoutes);
// app.use("/posts/:post_id/comments",commentsRoutes);
app.use("/",accessRoutes);

//ROOT
app.get('/', function(req,res){
  res.redirect('/signup');
});

//CATCH ALL
app.get('*', function(req,res){
  res.render('errors/404');
});

//START SERVER
app.listen(process.env.PORT || 3000, function() {
  "Server is listening on port 3000";
});