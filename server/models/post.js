const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LinkSchema = require('./link');

const PostSchema = new Schema({
  index: Number,
  title: String,
  published: Number,
  id: String,
  score: Number,
  url: String,
  author: String,
  comments: Number,
  links: [LinkSchema]
});

PostSchema.index({
  id: 1,
  author: 1,
  published: 1
}, {
  unique: true
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
