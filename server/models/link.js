const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    url: String,
    image: String,
    author: String,
    ISBN: String,
    title: String,
    description: String,
    ASIN: String
});

// Create a compound index to prevent dupes
// LinkSchema.index({ISBN: 1, title: 1, author: 1}, {unique: true});
// Removed this index because the same book may appear in 
// multiple weeks 

module.exports = LinkSchema;
