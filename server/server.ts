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

z.itemLookup({
    idType: 'ASIN',
    itemId: '0984999302',
    responseGroup: 'ItemAttributes,Medium,Images'
}).then((results) => {
    // console.log(JSON.stringify(results));
    console.log(results[0].DetailPageURL[0]);
    console.log(results[0].ImageSets[0]);
    console.log(results[0].ItemAttributes[0].Author);
    console.log(results[0].ItemAttributes[0].ISBN);
    console.log(results[0].ItemAttributes[0].Title);
    console.log(results[0].EditorialReviews[0].EditorialReview[0].Content);
    fs.writeFile('./server/processing/amzn.txt', JSON.stringify(results), (error) => console.log(error));
}).catch((err) => {
    console.log(err);
});

const r = new snow({
    userAgent: 'Get book lists',
    clientId: 'FyApUjvFK5lH3Q',
    clientSecret: '4Niv_Z2ZtIqwIixSRVN3a9bxlyI',
    username: 'jacobedawson',
    password: 'DYb&H^Hd3#7b'
});

// fetchSubreddit('startups');

// The following function retrieves the top 100 posts in a subreddit
// for the past week
function fetchSubreddit(name) {
    r.getSubreddit(name = 'startups')
        .getTop({
            limit: 100,
            time: 'week'
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
                comments: post.num_comments
            };
        })
        .then(allTopPosts => {
            allTopPosts.map(post => {
                fetchSingleRedditPost(post);
            });
        });
}

// TODO Get all threads & comments? for the past 7 days / 168 hours
// TODO Process all the links in the text, extract any that point to Amazon, Safari or O'Reilly
// TODO Verify that the link is to a book page (via Amazon Product API / metadata)

// This function will retrieve a reddit post by id
// then save it to a file for search processing
function fetchSingleRedditPost(post) {
    // console.log(`Id is ${post.id}`);
    r.getSubmission(post.id.toString())
        .fetch()
        .then(postData => checkPostForBookLinks(postData, post));
}

// This function will grab all amazon links if found in a post
function checkPostForBookLinks(postData, post) {
    const setOfLinks = getURLs(JSON.stringify(postData));
    const amazonLinks = filterLinks(Array.from(setOfLinks));
    const dedupedLinks = Array.from(new Set([...amazonLinks]));
    if (dedupedLinks.length > 0) {
        post.links = dedupedLinks;
        appendToFile(post);
    }
}

const isAmazon = /^https?:\/\/(smile\.am|amazon|amzn)/;
function filterLinks(arr) {
    return arr
        .filter(link => link.match(isAmazon))
        .map(link => linkCleaner(link));
}

// TODO - use compose or something here, too repetitive
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

function appendToFile(post) {
    const path = './server/processing';
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    const file = './server/processing/test.json';
    fs.stat(file, (err, stat) => {
        if (err) {
            console.log(err);
        }
        console.log(stat.size);
        if (stat.size === 0) {
            const x = [];
            jsonfile.writeFile(file, JSON.stringify(x), err => {
                console.log(err);
            });
        }
    });
    jsonfile.readFile(file, (err, data) => {
        const x = JSON.parse(data);
        x.push(post);
        const y = JSON.stringify(x);
        jsonfile.writeFile(file, y, e => {
            console.log('Error? ' + e);
        });
    });
}

app.listen(3000, () => {
    console.log('ReddReader server is listening on 3000');
});
