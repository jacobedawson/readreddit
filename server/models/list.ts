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

const List = mongoose.model('List', ListSchema);

export default List;
