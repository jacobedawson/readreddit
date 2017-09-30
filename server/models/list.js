const mongoose = require('mongoose');
const PostSchema = require('./post');

const Schema = mongoose.Schema;

const ListSchema = new Schema({
  week: Number, // e.g. 34
  year: Number, // e.g. 2017
  subreddit: String, // e.g. startups
  created: {
    type: Date,
    default: Date.now
  },
  posts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post',
      index: true,
      unique: true
  }] // array of posts
});

ListSchema.index({
  subreddit: 1,
  week: 1,
  year: 1
}, {
  unique: true
});

ListSchema.index({
  'posts.id' : 1
}, {
  unique: true
});


const List = mongoose.model('List', ListSchema);

module.exports = List;
