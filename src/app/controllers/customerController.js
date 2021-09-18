
const customer = require('../models/customer')


const {mutipleMongooseToObject} = require('../../util/mongoose')

class customerController {
     customer(req, res,next) {
        res.render('homeCustomer', {layout: 'customer' });
    }
    
}

module.exports = new customerController();
