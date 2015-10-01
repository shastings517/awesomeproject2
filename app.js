require('dotenv').load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var session = require("cookie-session");
var db = require('./models');
var loginMiddleware = require("./middleware/loginHelper");
var routeMiddleware = require("./middleware/routeHelper");
var usersRoutes = require("./routes/users");
var postsRoutes = require("./routes/posts");
var accessRoutes = require("./routes/access");
var request = require('request');
var favicon = require('serve-favicon');


app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
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