import * as mongoose from 'mongoose';
import { PostSchema } from './post';

const Schema = mongoose.Schema;

const ListSchema = new Schema({
    week: Number, // e.g. 34
    year: Number, // e.g. 2017
    subreddit: String, // e.g. startups
    created: Date,
    posts: [PostSchema] // array of posts
});

// Create a compound index on subreddit, year & week to prevent dupes
ListSchema.index({subreddit: 1, week: 1, year: 1}, {unique: true});

const List = mongoose.model('List', ListSchema);

export default List;
