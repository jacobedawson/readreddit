import * as express from 'express';
import * as currentWeek from 'current-week-number';
import * as MailChimp from 'mailchimp-api-v3';
import * as EmailValidator from 'email-validator';
import List from '../models/list';
import Catalog from '../models/catalog';


const router = express.Router();
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
    const query = subreddit ? { week, year, subreddit } : { week: w, year: y };
    List.find(query, (err, list) => {
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

router.get('/catalog', (req, res) => {
    Catalog.find({}, (err, catalog) => {
        if (err) {
            console.log(err);
            res.json({
                info: 'Error while retrieving catalog',
                error: err
            });
        }
        if (catalog) {
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

router.post('/newsletter', (req, res) => {
    console.log('Received newsletter post request');
    // Add subscriber to Mailchimp list
    if (!EmailValidator.validate(req.body.email)) {
        console.log('That email is invalid..');
        res.status(500).send({
            error: 'That email is invalid..'
        });
    } else {
        Mail.post('/lists/59a350c6df/members', {
            email_address: req.body.email,
            status: 'subscribed'
        }).then((err, success) => {
            console.log('Successfully added user to newsletter');
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

function verifyEmail(email) {
    // run check on email
    if (email) {
        return true;
    } else {
        return false;
    }
}

export default router;
