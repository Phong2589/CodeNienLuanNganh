
const product = require('../models/product');
const sha512 = require('js-sha512').sha512
const customer = require('../models/customer')
const order = require('../models/order')
const historyOrder = require('../models/historyOrder')
const { MongooseToObject } = require('../../util/mongoose')
const admin = require('../models/admin')
const staff = require('../models/staff')
const infoStaff = require('../models/infoStaff')

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
    async addProductDB(req, res, next) {
        req.body.image = req.file.path.split('\\').slice(2).join('/')
        req.body.image = "/" + req.body.image
        const productNew = new product(req.body)
        var result = await productNew.save()
        if (result) {
            req.session.message = {
                type: 'success',
                intro: 'Thêm sản phẩm thành công!',
                message: ''
            }
            res.redirect('/admin')
        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Thêm sản phẩm thất bại!',
                message: ''
            }
            res.redirect('/admin')
        }
    }
    async updateProduct(req, res, next) {
        var slug = req.params.slug
        var productFind = await product.findOne({ slug: slug })
        res.render('updateProduct', {
            layout: 'admin',
            product: MongooseToObject(productFind),
        });
    }
    async updateProductDB(req, res, next) {
        var slug = await req.params.slug
        var result
        if (req.file) {
            req.body.image = req.file.path.split('\\').slice(2).join('/')
            req.body.image = "/" + req.body.image
            result = await product.updateOne({ slug: slug }, {
                name: req.body.name,
                cost: req.body.cost,
                quantity: req.body.quantity,
                description: req.body.description,
                image: req.body.image
            })
        }
        else {
            result = await product.updateOne({ slug: slug }, {
                name: req.body.name,
                cost: req.body.cost,
                quantity: req.body.quantity,
                description: req.body.description,
            })
        }

        if (result) {
            req.session.message = {
                type: 'success',
                intro: 'Cập nhật sản phẩm thành công!',
                message: ''
            }
            res.redirect('/admin')
        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Cập nhật sản phẩm thất bại!',
                message: ''
            }
            res.redirect('/admin')
        }
    }
    async deleteProduct(req, res, next) {
        var slug = await req.params.slug

        var result = await product.delete({ slug: slug })
        if (result) {
            req.session.message = {
                type: 'success',
                intro: 'Sản phẩm đã được xóa!',
                message: ''
            }
            res.redirect('/admin')
        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa sản phẩm thất bại!',
                message: ''
            }
            res.redirect('/admin')
        }
    }
    async productDeleted(req, res, next) {
        var products = await product.findDeleted({})
        res.render('productDeleted', {
            layout: 'admin',
            products: mutipleMongooseToObject(products)
        })
    }
    async restoreproduct(req, res, next) {
        var slug = await req.params.slug
        var result = await product.restore({ slug: slug })
        if (result) {
            res.redirect('/admin/updateProduct/' + slug)
        }
        else {
            res.json('Lỗi Không thể khôi phục')
        }
    }
    async destroy(req, res, next) {
        var slug = await req.params.slug
        var result = await product.deleteOne({ slug: slug })
        if (result) {
            req.session.message = {
                type: 'success',
                intro: 'Sản phẩm đã được xóa!',
                message: ''
            }
            res.redirect('back')
        }
        else {
            res.json('Lỗi Không thể xóa vĩnh viễn')
        }
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

    async detailProduct(req, res, next) {
        var slug = req.params.slug
        var productFind = await product.findOne({ slug: slug })
        var productRelated = await product.aggregate([{ $sample: { size: 8 } }])
        res.render('detailProductAdmin', {
            layout: 'admin',
            product: MongooseToObject(productFind),
            products: productRelated,
        })
    }

    async addStaff(req, res, next) {
        res.render('addStaff', {
            layout: 'admin',
        })
    }

    async addStaffProcess(req, res, next) {

        var result = await staff.create({
            user: req.body.user,
            password: sha512(req.body.password)
        })
        var result2 = await infoStaff.create({
            user: req.body.user,
            name: req.body.name,
            gender: req.body.gender,
            phone: req.body.phone,
            address: req.body.address,
        })

        req.session.message = {
            type: 'success',
            intro: 'Nhân viên đã được thêm vào!',
            message: ''
        }
        res.redirect('/admin/listStaff')
    }
    async listStaff(req,res,next){
        var result = await infoStaff.find({})
        res.json(result)
    }


}

module.exports = new adminController();
