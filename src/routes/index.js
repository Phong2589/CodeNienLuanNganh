const siteRouter = require('./site');
const customerRouter = require('./customer');
const adminRouter = require('./admin');
const staffRouter = require('./staff');
const authCustomer = require('../util/validateCustomer')
const authStaff = require('../util/validateStaff')
const authAdmin = require('../util/validateAdmin')
const createSessionID = require('../util/createSessionID')


function route(app) {

    app.use('/customer', authCustomer.requireAuth, customerRouter);
    app.use('/staff',authStaff.requireAuth, staffRouter);
    app.use('/admin', authAdmin.requireAuth, adminRouter);
    app.use('/',createSessionID.createSessionID,siteRouter);
}

module.exports = route;
