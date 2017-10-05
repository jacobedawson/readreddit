const express = require('express');
const router = express.Router();
const currentWeek = require('current-week-number');
const MailChimp = require('mailchimp-api-v3');
const EmailValidator = require('email-validator');
const List = require('../models/list');
const Catalog = require('../models/catalog');
const History = require('../models/history');
const Post = require('../models/post');
const Mail = new MailChimp('d14170fd61cb4473a78d86ece46e91c6-us15');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Connected to API!'
    });
});

// Get all current lists, or the list for a particular subreddit
router.get('/list', (req, res) => {
    const w = currentWeek();
    const y = (new Date()).getFullYear();
    const week = req.query.week ? req.query.week : 0;
    const year = req.query.year ? req.query.year : 0;
    const subreddit = req.query.subreddit ? req.query.subreddit : false;
    const query = subreddit ? { week, year, subreddit } : {};
    List.find(query).sort({subreddit: 1}).exec((err, list) => {
        if (err) {
            res.json({
                info: 'Error while retrieving list',
                error: err
            });
        }
        if (list.length > 0) {
            res.json({
                info: 'Found ReddReader List',
                data: list
            });
        } else {
            res.json({
                info: 'No list matching that search found'
            });
        }
    });
});

router.get('/year/:y/week/:w', (req, res) => {
    const {y: year, w: week} = req.params;
    Catalog.find({year, week}).populate({
        path: 'results',
        model: 'List',
        populate: {
            path: 'posts',
            model: 'Post'
        }
    }).exec((err, catalog) => {
        if (err) {
            console.log(err);
            res.json({
                info: 'Error while retrieving catalog',
                error: err
            });
        }
        if (catalog && catalog.length > 0) {
            catalog[0].results = sortByPostSize(catalog[0].results);
            res.json({
                info: 'Found Catalog',
                data: catalog
            });
        } else {
            console.log('not found');
            res.status(404).send('Not Found');
        } 
    });
});

function sortByPostSize(catalog) {
    return catalog.sort((a,b) => b.posts.length - a.posts.length);
}

router.get('/catalog', (req, res) => {
    const week = req.query.week ? req.query.week : null;
    const year = req.query.year ? req.query.year : null;
    const query = week ? { week, year } : {};
    Catalog.find(query).sort({week: -1}).limit(1).populate({
        path: 'results',
        model: 'List',
        populate: {
            path: 'posts',
            model: 'Post',
            options: {
                sort: {
                    published: -1
                }
            }
        }
    }).exec((err, catalog) => {
        if (err) {
            console.log(err);
            res.json({
                info: 'Error while retrieving catalog',
                error: err
            });
        }
        if (catalog) {
            catalog[0].results = sortByPostSize(catalog[0].results);
            res.json({
                info: 'Found Catalog',
                data: catalog
            });
        } else {
            res.json({
                info: 'No catalog found'
            });
        }
    });
});

router.get('/history', (req, res) => {
    History.find({}).sort({week: -1}).exec((err, history) => {
        if (err) {
            console.log(err);
            res.json({
                info: "Error while retrieving history",
                error: err
            })
        }
        if (history) {
            res.json({
                info: "Found History",
                data: history
            });
        } else {
            res.json({
                info: "No History found..."
            });
        }
    });
});

router.post('/newsletter', (req, res) => {
    console.log('Received newsletter post request');
    if (!EmailValidator.validate(req.body.email)) {
        res.status(500).send({
            error: 'That email is invalid..'
        });
    } else {
        Mail.post('/lists/59a350c6df/members', {
            email_address: req.body.email,
            status: 'subscribed'
        }).then((err, success) => {
            res.status(200).send({
                info: 'success'
            })
        }).catch(err => {
            if (err) {
                res.status(400).send({
                    error: err
                });
            }
        });
    }
});

module.exports = router;
