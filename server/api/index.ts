import * as express from 'express';

const router = express.Router();

import List from '../models/list';

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Connected to API!'
    });
});

router.get('/list', (req, res) => {
    List.find({
        week: 32,
        year: 2017,
        subreddit: 'entrepreneur'
    }, (err, list) => {
        if (err) {
            res.json({
                info: 'Error while retrieving list',
                error: err
            });
        }
        if (list) {
            res.json({
                info: 'Found ReddReader List',
                data: list
            });
        }
    });
});

export default router;
