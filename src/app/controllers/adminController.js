
const product = require('../models/product');
const sha512 = require('js-sha512').sha512
const customer = require('../models/customer')
const order = require('../models/order')
const historyOrder = require('../models/historyOrder')
const { MongooseToObject } = require('../../util/mongoose')
const admin = require('../models/admin')

const { mutipleMongooseToObject } = require('../../util/mongoose')

class adminController {
    async home(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find({ quantity: { $gte: 1 } })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)
        res.render('homeAdmin', {
            layout: 'admin',
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }


    addProduct(req, res, next) {
        res.render('addProduct', { layout: 'admin' });
    }
    addProductDB(req, res, next) {
        req.body.image = req.file.path.split('\\').slice(2).join('/');
        const productNew = new product(req.body);
        productNew.save()
            .then(() => {
                res.send('thanh cong')
            })
            .catch(next);
    }

    logout(req, res, next) {
        res.clearCookie("adminId")
        res.redirect('/')
    }
    async changePassword(req, res, next) {
        res.render('changePasswordAdmin', {
            layout: 'admin',
        })
    }

    async checkPassword(req, res, next) {
        var pass = sha512(req.query.pass)
        var adminId = req.signedCookies.adminId
        var result = await admin.findOne({ id: adminId, password: pass })
        if (result) {
            res.send("")
        }
        else {
            res.send("no")
        }
    }
    async changePassAdPro(req, res, next) {
        var adminId = req.signedCookies.adminId
        var pass = sha512(req.body.newPassword)
        var result = await admin.updateOne({ id: adminId }, {
            password: pass
        })
        req.session.message = {
            type: 'success',
            intro: 'Chúc mừng bạn đã đổi mật khẩu thành công!',
            message: ''
        }
        res.redirect('/admin')
    }

    async sortaz(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "name": 1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)


        res.render('homeAdmin', {
            layout: 'admin',
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async sortza(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "name": -1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)

        res.render('homeAdmin', {
            layout: 'admin',
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async sortCostDecrease(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "cost": -1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)


        res.render('homeAdmin', {
            layout: 'admin',
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async sortCostIncrease(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "cost": 1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)

        res.render('homeAdmin', {
            layout: 'admin',
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async search(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find({ $text: { $search: req.query.search } })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)


        if (products) {
            res.render('searchAdmin', {
                layout: 'admin',
                products: mutipleMongooseToObject(products),
                quantityPage: quantityPageArr
            })
        }
        else {
            res.render('searchCustomer', {
                layout: 'customer',
            })
        }
    }

    async detailProduct(req,res,next){
        var slug = req.params.slug
        var productFind = await product.findOne({slug:slug})
        var productRelated = await product.aggregate([{ $sample: { size: 8} }])
        res.render('detailProductAdmin',{
            layout: 'admin',
            product: MongooseToObject(productFind),
            products: productRelated,
        })
    }
}

module.exports = new adminController();
