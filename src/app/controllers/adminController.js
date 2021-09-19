
const product = require('../models/product');


const {mutipleMongooseToObject} = require('../../util/mongoose')

class adminController {
    home(req, res,next) {
        product.find({},function (err, products) {
            res.render('homeAdmin',{
                    layout: 'admin',
                    products: mutipleMongooseToObject(products),
                })
        })
    }

    addProduct(req, res,next) {
        res.render('addProduct', {layout: 'admin' });
    }
    addProductDB(req,res,next){
        req.body.image = req.file.path.split('\\').slice(2).join('/');
        const productNew = new product(req.body);
        productNew.save()
            .then(() => {
                res.send('thanh cong')
            })
            .catch(next);
    }
    
}

module.exports = new adminController();
