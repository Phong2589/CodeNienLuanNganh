
const product = require('../models/product');
const order = require('../models/order')
const historyOrder = require('../models/historyOrder')
const staff = require('../models/staff')
const infoStaff = require('../models/infoStaff')
const moment = require('moment')
const sha512 = require('js-sha512').sha512
const cloudinary = require('cloudinary').v2
require('../../util/cloudinary')
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')

class staffController {

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
        res.render('homeStaff', {
            layout: 'staff',
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
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


        res.render('homeStaff', {
            layout: 'staff',
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

        res.render('homeStaff', {
            layout: 'staff',
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


        res.render('homeStaff', {
            layout: 'staff',
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

        res.render('homeStaff', {
            layout: 'staff',
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async sortNew(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "createdAt": -1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)

        res.render('homeStaff', {
            layout: 'staff',
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
                layout: 'staff',
                products: mutipleMongooseToObject(products),
                quantityPage: quantityPageArr
            })
        }
        else {
            res.render('searchAdmin', {
                layout: 'staff',
            })
        }
    }

    async detailProduct(req, res, next) {
        var slug = req.params.slug
        var productFind = await product.findOne({ slug: slug })
        var productRelated = await product.aggregate([{ $sample: { size: 8 } }])
        res.render('detailProductStaff', {
            layout: 'staff',
            product: MongooseToObject(productFind),
            products: productRelated,
        })
    }

    logout(req, res, next) {
        res.clearCookie("staffId")
        res.redirect('/')
    }

    async revenueDay(req, res, next) {
        const today = moment().startOf('day')
        var orders = await historyOrder.find({
            createdAt: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            },
            state: 1
        })
        var total = 0
        for (var i = 0; i < orders.length; i++) {
            total = total + orders[i].total
        }

        var date = new Date()
        var day = date.getDay()
        var strDay = ''
        if (day == 0) {
            strDay = "Chủ nhật";
        } else {
            for (var i = 1; i <= 6; i++) {
                if (day == i) {
                    strDay = "Thứ " + (i + 1);
                }
            }
        }
        var month = date.getMonth() + 1
        var year = date.getFullYear()
        var numberDay = date.getDate()
        res.render('revenueDay', {
            layout: 'staff',
            total: total,
            day: strDay,
            month: month,
            year: year,
            numberDay: numberDay
        })
    }
    async profile(req, res, next) {
        var staffId = req.signedCookies.staffId
        var staffFind = await staff.findOne({ id: staffId })
        var user = staffFind.user
        var info = await infoStaff.findOne({ user: user })
        if (info) {
            res.render('profileStaff', {
                layout: 'staff',
                info: MongooseToObject(info)
            })
        }
        else {
            res.render('profileStaff', {
                layout: 'staff',
            })
        }
    }
    async changePassword(req, res, next) {
        res.render('changePasswordStaff', {
            layout: 'staff',
        })
    }

    async checkPassword(req, res, next) {
        var pass = sha512(req.query.pass)
        var staffId = req.signedCookies.staffId
        var result = await staff.findOne({ _id: staffId, password: pass })
        if (result) {
            res.send("")
        }
        else {
            res.send("no")
        }
    }
    async changePassAdPro(req, res, next) {
        var staffId = req.signedCookies.staffId
        var pass = sha512(req.body.newPassword)
        var result = await staff.updateOne({ _id: staffId }, {
            password: pass
        })
        req.session.message = {
            type: 'success',
            intro: 'Chúc mừng bạn đã đổi mật khẩu thành công!',
            message: ''
        }
        res.redirect('/staff')
    }
    async awaitingConfirm(req, res, next) {
        var orders = await order.find({ state: 0 })
        res.render('awaitingConfirmAll', {
            layout: 'staff',
            orders: mutipleMongooseToObject(orders)
        })
    }
    async confirmOrder(req, res, next) {
        var slug = await req.params.slug
        var result = await order.updateOne({ orderId: slug }, {
            state: 1
        })
        if (result) {
            req.session.message = {
                type: 'success',
                intro: 'Đơn hàng ' + slug + ' đã được xác nhận!',
                message: ''
            }
            res.redirect('/staff/awaitingConfirm')
        }
        else {
            res.json('lỗi không thể xác nhận đơn hàng!')
        }
    }
    async cancelOrder(req, res, next) {
        try {
            var orderId = req.params.slug
            var orderDel = await order.findOne({ orderId: orderId })
            const orderSave = new historyOrder()
            orderSave.cusId = orderDel.cusId
            orderSave.orderId = orderDel.orderId
            orderSave.name = orderDel.name
            orderSave.phone = orderDel.phone
            orderSave.address = orderDel.address
            orderSave.note = orderDel.note
            orderSave.total = orderDel.total
            orderSave.state = -1
            orderSave.cart = orderDel.cart
            var result = await orderSave.save()
            for (var i = 0; i < orderDel.cart.length; i++) {
                var productFind = await product.findOne({ slug: orderDel.cart[i].slug })
                var quantityUpdate = productFind.quantity + orderDel.cart[i].quantityBuy
                var resultUpdate = await product.updateOne({ slug: orderDel.cart[i].slug }, { quantity: quantityUpdate })
            }
            var del = await order.deleteOne({ orderId: orderId })
            res.send('success')
        }
        catch (error) {
            res.json(error)
        }
    }
    async completeOrder(req, res, next) {
        try {
            var orderId = req.params.slug
            var orderDel = await order.findOne({ orderId: orderId })
            const orderSave = new historyOrder()
            orderSave.cusId = orderDel.cusId
            orderSave.orderId = orderDel.orderId
            orderSave.name = orderDel.name
            orderSave.phone = orderDel.phone
            orderSave.address = orderDel.address
            orderSave.note = orderDel.note
            orderSave.total = orderDel.total
            orderSave.state = 1
            orderSave.cart = orderDel.cart
            var result = await orderSave.save()
            var del = await order.deleteOne({ orderId: orderId })
            res.send('success')
        }
        catch (error) {
            res.json(error)
        }
    }
    async confirmed(req, res, next) {
        var orders = await order.find({ state: 1 })
        res.render('confirmedAll', {
            layout: 'staff',
            orders: mutipleMongooseToObject(orders)
        })
    }

    async history(req, res, next) {
        var orders = await historyOrder.find({}).limit(20).sort({ createdAt: -1 })
        res.render('historyOrderCus', {
            layout: 'staff',
            orders: mutipleMongooseToObject(orders)
        })
    }

    async changeAvatar(req, res, next) {
        res.render('changeAvatarStaff', {
            layout: 'staff'
        })
    }
    async changeAvatarStaffDB(req, res, next) {
        var image = req.query.pathFile
        var staffId = req.signedCookies.staffId
        var result = await staff.updateOne({ _id: staffId }, { image: image })
        res.send('abc')

    }


}

module.exports = new staffController();
