import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Dates = new Schema({
    year: Number,
    week: Number,
});

const CatalogSchema = new Schema({
    subreddit: String,
    dates: [Dates]
});

const Catalog = mongoose.model('Catalog', CatalogSchema);

export default Catalog;
