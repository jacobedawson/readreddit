import * as mongoose from 'mongoose';
import * as PostSchema from './post';

const Schema = mongoose.Schema;

const ListSchema = new Schema({
    /* 
        A list should include
            Year
            Subreddit Name
            Week e.g. 40
        The API should be able to grab the data like
            reddreader.com/api/list?year=2017&week=40&subreddit=startups
    */
    name: Number, // 302017 e.g. Week 30, 2017
    subreddit: String, // e.g. startups
    created: Date,
    postCount: Number,
    posts: [PostSchema] // array or object? should this be in a separate model?
});

const List = mongoose.model('List', ListSchema);

export { List };
