const express = require('express');
const app = express();
const snow = require('snoowrap'); // Reddit API wrapper
const fs = require('fs'); 
const getURLs = require('get-urls');

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

// The following function retrieves the top 100 posts in a subreddit
// for the past week 
// r.getSubreddit('startups')
//   .getTop({
//     limit: 100,
//     time: 'week'
//   })
//   .then()
//   .map((post, index) => {
//     console.log(post);
//     return {
//       index,
//       title: post.title,
//       id: post.id,
//       score: post.score,
//       url: post.url,
//       author: post.author,
//       comments: post.num_comments
//     }
//   })
//   .then(post => {
//     writeFile(JSON.stringify(post), 'top-posts','json');
//   });

// TASKS

// 2.) Get all threads & comments? for the past 7 days / 168 hours
// 3.) Process all the links in the text, extract any that point to Amazon, Safari or O'Reilly
// 4.) Verify that the link is to a book page (via Amazon Product API / metadata)

// This function will retrieve a reddit post by id
// then save it to a file for search processing
r.getSubmission('6s6r4a')
    .fetch()
    .then(post => checkPostForBookLinks(post));

function checkPostForBookLinks(post) {
    const setOfLinks = getURLs(JSON.stringify(post));
    for (let link of setOfLinks) {
        if (!link.includes('amazon') || link.includes('a%3') || link.includes('n-')) {
            setOfLinks.delete(link);
        }
    }
    console.log(setOfLinks);
}

function writeFile(data, filename = 'temp', extension = 'txt') {
  const path = `./server/processing/${filename}.${extension}`;
  fs.writeFile(path, data, (err) => {
    if (err) console.log(err);
    console.log('Successfully wrote file');
  });
}

app.listen(3000, () => {
  console.log('ReddReader server is listening on 3000');
});
