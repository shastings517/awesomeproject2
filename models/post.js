var mongoose = require('mongoose');
// var Comment = require('./comment');
var date = new Date();
var datePost = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var postSchema = new mongoose.Schema ({
                    body: {type: String, required: true},
                    high: String,
                    low: String,
                    sleep: Number,
                    meditate: String,
                    diet: String,
                    improvements: String,

                    // title: {type: String, required: true},
                    // media: String,
                    // comments: [{
                    //   type: mongoose.Schema.Types.ObjectId,
                    //   ref: "Comment"
                    // }],
                    author: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"
                    },
                    date: {type: String, default: datePost}
                  });


var Post = mongoose.model("Post", postSchema);

var thing = Post.create;

console.log();

module.exports = Post;