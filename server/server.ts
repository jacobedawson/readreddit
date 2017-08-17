// const _ = require('ramda');
import * as express from 'express';
import * as snow from 'snoowrap';
import * as fs from 'fs';
import * as getURLs from 'get-urls';
import * as jsonfile from 'jsonfile';
import * as amazon from 'amazon-product-api';

const app = express();
app.get('/', (req, res) => {
    res.send('Hello world');
});

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

/*
    This function will retrieve a reddit post by id
    then return it to be searched for book links
*/
const fetchSingleRedditPost = function(post) {
    r.getSubmission(post.id.toString())
        .fetch()
        .then(postData => checkPostForBookLinks(postData, post));
}

/*
    This function retrieves the top N posts in a subreddit
    for the past X amount of time
*/
const fetchSubreddit = function(name = 'startups', limit = 10, time = 'month') {
    r.getSubreddit(name)
        .getTop({
            limit: 10,
            time: 'month'
        })
        .then()
        .map((post, index) => {
            return {
                index,
                title: post.title,
                id: post.id,
                score: post.score,
                url: post.url,
                author: post.author,
                comments: post.num_comments,
                links: []
            };
        })
        .then(allTopPosts => {
            allTopPosts.map(post => {
                fetchSingleRedditPost(post);
            });
        });
};

fetchSubreddit('startups');



//  This function will grab all amazon links if found in a post
function checkPostForBookLinks(postData, post) {
    const setOfLinks = getURLs(JSON.stringify(postData));
    const amazonLinks = filterLinks(Array.from(setOfLinks));
    const dedupedLinks = Array.from(new Set([...amazonLinks]));
    if (dedupedLinks.length > 0) {
        const arrayOfPromises = dedupedLinks.map(link => {
            const productID = link.substr(link.length - 10);
            return amazonItemLookup(productID, post);
        });
        Promise.all(arrayOfPromises).then((results) => {
            appendToFile(post); // This will probably a db call
        });
    }
}

/*
    Check if the link contains any amazon related url components
*/
const isAmazon = /^https?:\/\/(smile\.am|amazon|amzn)/;
function filterLinks(arr) {
    return arr
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
function amazonItemLookup(itemID: string, post): Promise<any> {
    return z.itemLookup({
        idType: 'ASIN',
        itemId: `${itemID}`,
        responseGroup: 'ItemAttributes,Medium,Images'
    }).then(results => {
        if (results && results[0]) {
            const resultsObject = results[0];
            post.links.push({
                url: resultsObject.DetailPageURL[0],
                image: resultsObject.LargeImage[0].URL,
                author: resultsObject.ItemAttributes[0].Author,
                ISBN: resultsObject.ItemAttributes[0].ISBN,
                title: resultsObject.ItemAttributes[0].Title,
                description: resultsObject.EditorialReviews[0].EditorialReview[0].Content
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

/*
    This function takes in a post, creates a directory if it doesn't already exist
    and also creates a file if it doesn't exist. jsonfile.readFile will attempt to
    open a file if it exists, and create one if it doesn't.
    If the file doesn't exist that means we need to create a json object, with
    a data array. If the file exists, we pull out the json file and push to the data array.
*/
function appendToFile(post) {
    const path = './server/processing';
    try {
        fs.accessSync(path);
    } catch (e) {
        fs.mkdirSync(path);
    }
    const file = './server/processing/test.json';
    jsonfile.readFile(file, (err, data) => {
        if (err) {
            const x = {
                'data': [
                    post
                ]
            };
            jsonfile.writeFile(file, JSON.stringify(x), error => {
                console.log(error);
            });
        } else {
            const x = JSON.parse(data);
            x.data.push(post);
            const y = JSON.stringify(x);
            jsonfile.writeFile(file, y, e => {
                console.log('Error? ' + e);
            });
        }
    });
}

app.listen(3000, () => {
    console.log('ReddReader server is listening on 3000');
});
