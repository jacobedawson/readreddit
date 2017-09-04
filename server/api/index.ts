import * as express from 'express';
import List from '../models/list';
import Catalog from '../models/catalog';

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Connected to API!'
    });
});

router.get('/list', (req, res) => {
    const week = req.query.week ? req.query.week : 0;
    const year = req.query.year ? req.query.year : 0;
    const subreddit = req.query.subreddit ? req.query.subreddit : '';
    List.find({
        week: week,
        year: year,
        subreddit: subreddit
    }, (err, list) => {
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
            })
        } else {
            res.json({
                info: 'No catalog found'
            });
        }
    });
});

export default router;
