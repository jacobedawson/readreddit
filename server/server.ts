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
import * as cron from 'node-cron'; // cron.schedule ...
import * as week from 'current-week-number';
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/reddreader');

import List from './models/list';
import Catalog from './models/catalog';

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
    try {
        const processedSubreddit = await r.getSubreddit(name)
            .getTop({ limit, time })
            .then()
            .map((post, index) => { // map over each post, return an array of processed posts
                return {
                    index,
                    title: post.title,
                    id: post.id,
                    published: post.created_utc,
                    score: post.score,
                    url: post.url,
                    author: post.author.name,
                    comments: post.num_comments,
                    links: []
                };
            })
            .then()
            .map(async post => { // map over each processed post, return a processed array
                return await fetchSingleRedditPost(post);
            });
        return processedSubreddit;
    } catch (err) {
        console.log(err);
    }
};

/* Daily Cron Jobs */
const block1 = new cron({
    // sec, min, hour, days of month, month, days of week
    cronTime: '00 00 11 * * *',
    // run this function
    function() {
        /* Runs every day at 11:00:00 AM */
        getNewPosts([
            'askscience',
            'atheism',
            'bookClub',
            'bookhaul',
            'BookLists',
            'booksuggestions',
            'comics'
        ]);
    },
    start: true,
    timeZone: 'America/Los_Angeles'
});
const block2 = new cron({
    cronTime: '00 00 12 * * *',
    // run this function
    function() {
        /* Runs every day at 11:00:00 AM */
        getNewPosts([
            'entrepreneur',
            'explainlikeimfive',
            'Fantasy',
            'GetMotivated',
            'history',
            'HorrorLit',
            'personalfinance'
        ]);
    },
    start: true,
    timeZone: 'America/Los_Angeles'
});
const block3 = new cron({
    cronTime: '00 00 13 * * *',
    // run this function
    function() {
        /* Runs every day at 13:00:00 PM */
        getNewPosts([
            'philosophy',
            'printSF',
            'programming',
            'science',
            'seduction'
        ]);
    },
    start: true,
    timeZone: 'America/Los_Angeles'
});
const block4 = new cron({
    cronTime: '00 00 14 * * *',
    // run this function
    function() {
        /* Runs every day at 14:00:00 PM */
        getNewPosts([
            'startups',
            'suggestmeabook',
            'webdev',
            'whatsthatbook',
            'YALit'
        ]);
    },
    start: true,
    timeZone: 'America/Los_Angeles'
});

block1.start();
block2.start();
block3.start();
block4.start();

// getNewPosts([
    // 'askscience',
    // 'atheism',
    // 'bookClub',
    // 'bookhaul',
    // 'BookLists',
    // 'booksuggestions',
    // 'comics',
    // 'entrepreneur',
    // 'explainlikeimfive',
    // 'Fantasy',
    // 'GetMotivated',
    // 'history',
    // 'HorrorLit',
    // 'personalfinance',
    // 'philosophy',
    // 'printSF',
    // 'programming',
    // 'science',
    // 'seduction',
    // 'startups',
    // 'suggestmeabook',
    // 'webdev',
    // 'whatsthatbook',
    // 'YALit'
// ]);
function getNewPosts(listOfSubs) {
    const w = week();
    const y = (new Date()).getFullYear();
    listOfSubs.map(sub => {
        console.log(sub);
        fetchSubreddit(sub, 100, 'week').then(posts => {
            const processedPosts = removeEmptyLinks(posts);
            console.log(processedPosts);
            if (processedPosts.length === 0) {
                console.log('No content, skipping this subreddit');
                return;
            }
            updateCatalog(sub, y, w);
            const compiledList = new List({
                week: w,
                year: y,
                subreddit: sub,
                created: Date.now(),
                posts: processedPosts
            });
            compiledList.save((err) => {
                if (err) {
                    console.log(err);
                }
                console.log('COMPLETE: 🔥');
            });
        }).catch((e) => {
            console.log(e);
            console.log(`Error collecting ${sub}`);
        });
    });
}

function updateCatalog(sub, year, week) {
    console.log('####>>>>>>>SUBBBBBBB: ' + sub);
    // Does the category exist yet?
    Catalog.findOne({
        subreddit: sub
    }, (err, entry) => {
        if (err) {
            console.log(err);
            return;
        }
        if (entry) {
            // If yes, does the specific date exist?
            Catalog.findOne({
                subreddit: sub,
                'dates.year': year,
                'dates.week': week
            }, (e, match) => {
                if (e) {
                    console.log(err);
                }
                if (match) {
                    // if yes, exit
                    console.log('existing doc found');
                    return;
                } else {
                    // otherwise, update the entry
                    entry.dates.push({
                        year,
                        week
                    });
                    entry.save((error) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('updated new date');
                        }
                    });
                }
            });
        } else {
            // Create a new entry if none exists
            const newCatalogEntry = new Catalog({
                subreddit: sub,
                dates: {
                    year,
                    week
                }
            });
            console.log('THIS IS X: ' + newCatalogEntry);
            newCatalogEntry.save(e => {
                console.log('writing new');
                if (e) {
                    console.log(e);
                }
            });
        }
    });
}

function removeEmptyLinks(posts) {
    // return an array of filtered posts
    return posts.filter(singlePost => {
        // mutate the post by removing null values
        singlePost.links = singlePost.links.filter(Boolean);
        // return only the posts that have actual links
        return singlePost.links.length > 0;
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
