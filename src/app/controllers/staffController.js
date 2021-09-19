
const product = require('../models/product');


const {mutipleMongooseToObject} = require('../../util/mongoose')

class staffController {

    home(req, res,next) {
        product.find({},function (err, products) {
            res.render('homeStaff',{
                    layout: 'staff',
                    products: mutipleMongooseToObject(products),
                })
        })
    }
    
}

module.exports = new staffController();
