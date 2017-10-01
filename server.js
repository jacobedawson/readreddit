// const _ = require('ramda');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const snow = require('snoowrap');
const fs = require('fs');
const getURLs = require('get-urls');
const amazon = require('amazon-product-api');
const router = require('./server/api');
const mongoose = require('mongoose');
const cron = require('node-cron');
const week = require('current-week-number');
const path = require('path');
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/reddreader');
mongoose.connect('mongodb://localhost/reddreader-alt');
// mongoose.connect(
//     'mongodb://root:U16V$UsbHma#@reddreader-shard-00-00-ezqrg.mongodb.net:27017,reddreader-shard-00-01-ezqrg.mongodb.net:27017,reddreader-shard-00-02-ezqrg.mongodb.net:27017/reddreader?ssl=true&replicaSet=Reddreader-shard-0&authSource=admin');

const List = require('./server/models/list');
const Catalog = require('./server/models/catalog');
const History = require('./server/models/history');
const Post = require('./server/models/post');

require('zone.js/dist/zone-node');
require('reflect-metadata');
const ngUniversal = require('@nguniversal/express-engine');
const {
  provideModuleMap
} = require('@nguniversal/module-map-ngfactory-loader');
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require('./dist-server/public/main.bundle');

function angularRouter(req, res) {
  res.render('index', {
    req,
    res
  });
}

const app = express();

app.engine('html', ngUniversal.ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
app.set('view engine', 'html');
app.set('views', 'dist/public');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);

app.get('/', angularRouter);

app.use(express.static(`${__dirname}/dist/public`));
// app.use('/', express.static(path.join(__dirname, './dist/public')));

app.get('/sitemap.xml', (req, res) => {
  res.sendFile((`${__dirname}/dist/public/assets/sitemap.xml`));
});

app.get('*', angularRouter);

app.listen(3000, () => console.log('Listening on 3000'));

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
      .getTop({
        limit,
        time
      })
      .then()
      .map((post, index) => {
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


cron.schedule('0 30 22 * * 0 - 6',
    () => {
        console.log('Running Cron Job #1');
        getNewPosts([
            'askscience',
            'atheism',
            'bookClub',
            'bookhaul',
            'BookLists',
            'booksuggestions',
            'comics'
        ]);
    }, true
);
cron.schedule('0 0 23 * * 0 - 6',
    () => {
        console.log('Running Cron Job #2');
        getNewPosts([
            'entrepreneur',
            'explainlikeimfive',
            'Fantasy',
            'GetMotivated',
            'history',
            'HorrorLit',
            'personalfinance'
        ]);
    }, true
);
cron.schedule('0 30 23 * * 0 - 6',
    () => {
        console.log('Running Cron Job #3');
        getNewPosts([
            'philosophy',
            'printSF',
            'programming',
            'science',
            'seduction'
        ]);
    }, true
);
cron.schedule('0 59 23 * * 0 - 6',
    () => {
        console.log('Running Cron Job #4');
        getNewPosts([
            'startups',
            'suggestmeabook',
            'webdev',
            'whatsthatbook',
            'YALit'
        ]);
    }, true
);


// getNewPosts([
  // 'askscience',
  // 'atheism',
  // 'bookClub',
  // 'bookhaul',
  // 'BookLists',#
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
    fetchSubreddit(sub, 100, 'day').then(posts => {
      const processedPosts = posts && posts.length > 0 ? removeEmptyLinks(posts) : [];
      if (processedPosts.length === 0) {
        console.log('No content, skipping this subreddit');
        return;
      }
      // Create multiple new post documents in one go
      Post.insertMany(processedPosts, (err, docs) => {
        if (err) {
          console.log(err);
        }
        if (docs) {
          console.log(docs);
          console.log('added new posts');
          // docs is an array of the posts
          // each has a new id, which we can push to 
          // the appropriate list
          const postIDs = docs.map(doc => doc._id);
          List.findOneAndUpdate({
            year: y,
            week: w,
            subreddit: sub
          }, {
            $addToSet: {
              posts: {
                $each: postIDs
              }
            }
          }, {
            upsert: true,
            new: true
          }, (err, list) => {
            if (err) {
              console.log(err);
            } else {
              updateCatalog(list._id, y, w);
              updateHistory(y, w);
              console.log('COMPLETE: 🔥');
            }
          });
        }
      });
    }).catch((e) => {
      console.log(e);
      console.log(`Error collecting ${sub}`);
    });
  });
}

function updateCatalog(id, year, week) {
  Catalog.findOneAndUpdate({
    year,
    week
  }, {
    $addToSet: {
      "results": id
    }
  }, {
    upsert: true
  }, (err, res) => {
    if (err) console.log(err);
  });
}

function updateHistory(year, week) {
  const updatedHistory = new History({
    year: year,
    week: week
  });
  updatedHistory.save((err, confirmation) => {
    if (err) {
      console.log(err);
    } else {
      console.log('New History Saved');
    }
  })
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
function amazonItemLookup(itemID) {
  console.log(itemID);
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

// app.get('/*', function(req, res) {
//     res.sendFile(path.join(__dirname, './dist/public/index.html'));
//   });
