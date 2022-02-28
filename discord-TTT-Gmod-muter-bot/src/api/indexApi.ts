//import needed packages
import express from 'express';
//import routes
import routes from './routes/indexRoute';
import errorsRoute from './routes/errors/errorsRoute';
//create app
const app = express();
//setup app (port,usw)
app.set('port', process.env.PORT || 3000);
//setup routes
app.use('/api', routes);
app.use('/error', errorsRoute);
//setup not found route
const notFoundRoute = express.Router();
notFoundRoute.get('*', (req, res) => {
    res.redirect('/error/404');
});
app.use('/', notFoundRoute);
//export app
export default app;