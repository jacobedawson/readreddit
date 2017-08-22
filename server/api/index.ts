import * as express from 'express';

const router = express.Router();

import List from '../models/list';

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Connected to API!'
    });
});

router.get('/list', (req, res) => {
    // TODO - use req / params for query
    // e.g. http://localhost:3000/api/list?week=32&year=2017&subreddit=entrepreneur
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

export default router;
