var mongoose = require('mongoose');
var date = new Date();
var datePost = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var postSchema = new mongoose.Schema ({
                    high: String,
                    highSentiment: Number,
                    low: String,
                    lowSentiment: Number,
                    sleep: Number,
                    meditate: {type: String, lowercase: true},
                    diet: {type: String, lowercase: true},
                    improvements: String,
                    score: Number, 
                    author: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"
                    },
                    date: {type: String, required: true, default: datePost}
                  });


var Post = mongoose.model("Post", postSchema);

var thing = Post.create;

console.log();

module.exports = Post;