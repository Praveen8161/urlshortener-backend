import express from 'express';
import { addURL } from '../controller/shortURL.js';

const router = express.Router();

// create a Short URL
router.post('/create', async (req, res) => {
    try{

        const newURL = await addURL(req);
        if(!newURL) res.status(400).json({
            message: 'Error while updating data' ,
            acknowledged: false
        });
        res.status(201).json({message: 'Short URL created', acknowledged: true});

    }catch(err){
        res.status(500).json({
            message: 'Internal server error',
            acknowledged: false,
            error: err
        });
    }
})

router.get('/:shorturl', async (req, res) => {
    try{

        

    }catch(err){
        res.status(500).json({
            message: 'Internal server error',
            acknowledged: false,
            error: err
        });
    }
});

export const shortURLRouter = router;