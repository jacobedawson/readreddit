const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ListSchema = require('./list');
/* 
    This schema contains a list of ids
    of results from the reddit scraping
*/
const CatalogSchema = new Schema({
    year: Number,
    week: Number,
    results: [{
        type: Schema.Types.ObjectId,
        ref: 'List',
        index: true,
        unique: true
    }]
});

CatalogSchema.index({
    year: 1,
    week: 1
}, {
    unique: true
});


const Catalog = mongoose.model('Catalog', CatalogSchema);

module.exports = Catalog;
