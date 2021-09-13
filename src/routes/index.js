const siteRouter = require('./site');
const customerRouter = require('./customer');

function route(app) {
    app.use('/customer',customerRouter);
    app.use('/', siteRouter);
}

module.exports = route;
