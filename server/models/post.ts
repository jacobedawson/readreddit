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

PostSchema.index({
    id: 1
}, {
    unique: true
});

export { PostSchema };
