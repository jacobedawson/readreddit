const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    url: String,
    image: String,
    author: String,
    ISBN: String,
    title: String,
    descript: String
});

// Create a compound index to prevent dupes
LinkSchema.index({ISBN: 1, title: 1, author: 1}, {unique: true});

module.exports = LinkSchema;
