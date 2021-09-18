const siteRouter = require('./site');
const customerRouter = require('./customer');
const adminRouter = require('./admin');

function route(app) {

    app.use('/customer',customerRouter);
    app.use('/admin',adminRouter);
    app.use('/', siteRouter);
}

module.exports = route;
