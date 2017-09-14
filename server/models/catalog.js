const mongoose = require('mongoose');
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

module.exports = Catalog;
