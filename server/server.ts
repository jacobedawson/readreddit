// const _ = require('ramda');
import * as express from 'express';
import * as snow from 'snoowrap';
import * as fs from 'fs';
import * as getURLs from 'get-urls';
import * as jsonfile from 'jsonfile';

const app = express();
app.get('/', (req, res) => {
    res.send('Hello world');
});

// TODO remove hardcoded credentials, use ENV VARs
const r = new snow({
    userAgent: 'Get book lists',
    clientId: 'FyApUjvFK5lH3Q',
    clientSecret: '4Niv_Z2ZtIqwIixSRVN3a9bxlyI',
    username: 'jacobedawson',
    password: 'DYb&H^Hd3#7b'
});

fetchSubreddit('startups');

// The following function retrieves the top 100 posts in a subreddit
// for the past week
function fetchSubreddit(name) {
    r.getSubreddit(name = 'startups')
        .getTop({
            limit: 10,
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
    if (amazonLinks.length > 0) {
        post.links = amazonLinks;
        appendToFile(post);
    }
}

const isAmazon = /^https?:\/\/(smile\.am|amazon|amzn)/;
function filterLinks(arr) {
    return arr.filter(link => link.match(isAmazon));
}

function appendToFile(post) {
    const file  = './server/processing/test.json';
    jsonfile.writeFile(file, post, {flag: 'a'}, (err) => {
            console.log(err);
    });
}

function writeFile(data, filename = 'temp', extension = 'txt') {
    const path = `./server/processing/${filename}.${extension}`;
    fs.writeFile(path, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Successfully wrote file');
        }
    });
}

app.listen(3000, () => {
    console.log('ReddReader server is listening on 3000');
});
