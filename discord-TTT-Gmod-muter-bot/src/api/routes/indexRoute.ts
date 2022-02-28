//import packages
import express from 'express';
//create a route
const router = express.Router();
//import routes
import authRoute from './auth/authRoute';
import addonRoute from './addon/addonRoute';
//setup routes
router.use('/auth', authRoute);
router.use('/addon', addonRoute);
//setup default route
router.get('/', (req, res) => {
    res.send('Api is working');
});

export default router;