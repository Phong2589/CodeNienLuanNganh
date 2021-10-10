const siteRouter = require('./site');
const customerRouter = require('./customer');
const adminRouter = require('./admin');
const staffRouter = require('./staff');
const authCustomer = require('../util/validateCustomer')
const authStaff = require('../util/validateStaff')
const authAdmin = require('../util/validateAdmin')
const createSessionID = require('../util/createSessionID')
const quantityCart = require('../util/responseQuantityCart')


function route(app) {

    app.use('/customer', createSessionID.createSessionID,authCustomer.requireAuth, customerRouter);
    app.use('/staff',authStaff.requireAuth, staffRouter);
    app.use('/admin', authAdmin.requireAuth, adminRouter);
    app.use('/',createSessionID.createSessionID,quantityCart.quantityCart,siteRouter);
}

module.exports = route;
