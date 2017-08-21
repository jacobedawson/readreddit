import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    url: String,
    image: String,
    author: String,
    ISBN: String,
    title: String,
    descript: String
});

module.exports = LinkSchema;