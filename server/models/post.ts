import * as mongoose from 'mongoose';
import { LinkSchema } from './link';

const Schema = mongoose.Schema;

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

export { PostSchema };
