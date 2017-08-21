import * as mongoose from 'mongoose';
import * as LinkSchema from './link';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    index: Number,
    title: String,
    id: String,
    score: Number,
    url: String,
    author: String,
    comments: Number,
    links: [LinkSchema]
});

module.exports = PostSchema;