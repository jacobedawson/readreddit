// const _ = require('ramda');
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as snow from 'snoowrap';
import * as fs from 'fs';
import * as getURLs from 'get-urls';
import * as jsonfile from 'jsonfile';
import * as amazon from 'amazon-product-api';
import router from './api';
import * as mongoose from 'mongoose';
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/reddreader');

import List from './models/list';

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => res.send('Hello world'));
app.use('/api', router);


// TODO remove hardcoded credentials, use ENV VARs
const z = amazon.createClient({
    awsId: 'AKIAIYCQD7MAVTQB3TZQ',
    awsSecret: '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',
    awsTag: 'readreddit-20'
});

const r = new snow({
    userAgent: 'Get book lists',
    clientId: 'FyApUjvFK5lH3Q',
    clientSecret: '4Niv_Z2ZtIqwIixSRVN3a9bxlyI',
    username: 'jacobedawson',
    password: 'DYb&H^Hd3#7b'
});

//  This function will grab all amazon links if found in a post
function checkPostForBookLinks(postData) {
    const setOfLinks = getURLs(JSON.stringify(postData)); // extract all links
    const amazonLinks = filterLinks(Array.from(setOfLinks)); // filter non amazon links
    const dedupedLinks = Array.from(new Set([...amazonLinks])); // dedupe using set and return an array
    return dedupedLinks.length > 0 ? dedupedLinks : [];
}

/*
    This function retrieves the top N posts in a subreddit
    for the past X amount of time
*/
const fetchSubreddit = async function (name = 'startups', limit = 10, time = 'month') {
    return r.getSubreddit(name)
        .getTop({ limit, time })
        .then()
        .map((post, index) => { // map over each post, return an array of processed posts
            return {
                index,
                title: post.title,
                id: post.id,
                score: post.score,
                url: post.url,
                author: post.author.name,
                comments: post.num_comments,
                links: []
            };
        })
        .then()
        .map(post => { // map over each processed post, return a processed array
            return fetchSingleRedditPost(post);
        });
};

// fetchSubreddit('entrepreneur', 10).then(posts => {
//     const processedPosts = removeEmptyLinks(posts);
//     console.log('COMPLETE: 🔥');
//     console.log(processedPosts);
//     const x = new List({
//         week: 32,
//         year: 2017,
//         subreddit: 'entrepreneur',
//         created: Date.now(),
//         posts: processedPosts
//     });
//     x.save((err) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log('Saved list');
//     });
// });

function removeEmptyLinks(posts) {
    return posts.filter(post => {
        const filteredArray = post.links.filter((link) => {
            return link !== undefined;
        });
        return filteredArray.length > 0;
    });
}

/*
    This function will retrieve a reddit post by id
    then return it to be searched for book links
*/
function fetchSingleRedditPost(post) {
    const postID = post.id.toString();
    return r.getSubmission(postID)
        .fetch()
        .then(postData => {
            post.links = checkPostForBookLinks(postData);
            return Promise.all(post.links.map(link => {
                const productID = link.substr(link.length - 10);
                return amazonItemLookup(productID);
            }));
        }).then(amazonData => {
            post.links = amazonData;
            return post;
        });
};

// Check if the link contains any amazon related url components
const isAmazon = /^https?:\/\/(smile\.am|amazon|amzn)/;
function filterLinks(rawLinks) {
    return rawLinks
        .filter(link => link.match(isAmazon))
        .map(link => linkCleaner(link));
}

/*
    TODO - use compose or something here, too repetitive
    Strip special characters and the smile subdomain
*/
function linkCleaner(link) {
    if (link.indexOf('%') > -1) {
        const idx = link.indexOf('%');
        link = link.slice(0, idx);
    }
    if (link.indexOf('/n-') > -1) {
        const idx = link.indexOf('/n-');
        link = link.slice(0, idx);
    }
    if (link.indexOf(')') > -1) {
        const idx = link.indexOf(')');
        link = link.slice(0, idx);
    }
    if (link.indexOf('?') > -1) {
        const idx = link.indexOf('?');
        link = link.slice(0, idx);
    }
    if (link.indexOf('smile.') > -1) {
        link = link.replace('smile.', '');
    }
    if (link.indexOf('/ref=') > -1) {
        const idx = link.indexOf('/ref=');
        link = link.slice(0, idx);
    }
    if (link.endsWith('/')) {
        link = link.slice(0, -1);
    }
    return link;
}

/*
    this function takes an itemID and searches the Amazon product database.
    If the item is found, we create an object with the item attributes and then
    return it, to be pushed into the post object's item array.
*/
function amazonItemLookup(itemID: string): Promise<any> {
    return z.itemLookup({
        idType: 'ASIN',
        itemId: `${itemID}`,
        responseGroup: 'ItemAttributes,Medium,Images'
    }).then(results => {
        if (results && results[0] && results[0].ItemAttributes[0].Author) {
            const resultsObject = results[0];
            return {
                url: resultsObject.DetailPageURL[0],
                image: resultsObject.LargeImage[0].URL,
                author: resultsObject.ItemAttributes[0].Author,
                ISBN: resultsObject.ItemAttributes[0].ISBN,
                title: resultsObject.ItemAttributes[0].Title,
                description: resultsObject.EditorialReviews[0].EditorialReview[0].Content
            };
        } else {
            return undefined;
        }
    }).catch((err) => {
        console.dir(err);
    });
}

app.listen(3000, () => console.log('Listening on 3000'));
