//import packages
import express from 'express';
//create a route
const router = express.Router();
//setup routes
router.get('/400', (req, res) => {
    res.send('400 - Bad Request');
});
router.get('/404', (req, res) => {
    res.send('404 - Not Found');
});
router.get('/500', (req, res) => {
    res.send('500 - Internal Server Error');
});

export default router;