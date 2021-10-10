
const customer = require('../models/customer')
const product = require('../models/product')
const order = require('../models/order')

const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')


class customerController {
     customer(req, res,next) {
        product.find({}, function (err, products) { 
            res.render('homeCustomer', {
                layout: 'customer',
                products: mutipleMongooseToObject(products),
            })
        })
    }
    
    order(req,res,next){
        const orderNew = new order(req.body)
        orderNew.save()
        res.render('orderSuccess',{
            layout: 'customer',
        })
    }
}

module.exports = new customerController();
