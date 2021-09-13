
const customer = require('../models/customer')


const {mutipleMongooseToObject} = require('../../util/mongoose')

class customerController {
     user(req, res,next) {
        res.render('test', { title: 'my other page', layout: 'customer' });
    }
    
}

module.exports = new customerController();
