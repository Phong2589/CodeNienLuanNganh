
const product = require('../models/product');
const sha512 = require('js-sha512').sha512
const customer = require('../models/customer')
const order = require('../models/order')
const historyOrder = require('../models/historyOrder')
const admin = require('../models/admin')
const staff = require('../models/staff')
const infoStaff = require('../models/infoStaff')
const moment = require('moment')
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')


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
        productNew.sold = 0
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
        var result = await admin.findOne({ _id: adminId, password: pass })
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
        var result = await admin.updateOne({ _id: adminId }, {
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
    async sortNew(req,res,next){
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
            res.render('searchAdmin', {
                layout: 'admin',
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
    async listStaff(req, res, next) {
        var result = await infoStaff.find({})
        res.render('listStaff', {
            layout: 'admin',
            staffs: mutipleMongooseToObject(result),
        })
    }
    async updateStaff(req, res, next) {
        var user = await req.params.user
        var staffFind = await infoStaff.findOne({ user: user })
        if (staffFind.gender == 'Nữ') {
            res.setHeader('gender', 'nu')
        }
        else res.setHeader('gender', staffFind.gender)
        res.render('updateStaff', {
            layout: 'admin',
            staff: MongooseToObject(staffFind),
        })
    }
    async updateStaffProcess(req, res, next) {
        var user = await req.params.user
        var result = await infoStaff.updateOne({ user: user }, {
            name: req.body.name,
            phone: req.body.phone,
            gender: req.body.gender,
            address: req.body.address,

        })
        req.session.message = {
            type: 'success',
            intro: 'Thông tin nhân viên đã được cập nhật!',
            message: ''
        }
        res.redirect('/admin/listStaff')
    }
    async deleteStaff(req, res, next) {
        var user = await req.params.user
        var result = await infoStaff.deleteOne({ user: user })
        var result2 = await staff.deleteOne({ user: user })
        if (result && result2) {
            req.session.message = {
                type: 'success',
                intro: 'Xóa nhân viên thành công!',
                message: ''
            }
            res.redirect('/admin/listStaff')
        }
        else {
            res.json('Lỗi không thể xóa nhân viên')
        }
    }

    async awaitingConfirm(req, res, next) {
        var orders = await order.find({ state: 0 })
        res.render('awaitingConfirmAll', {
            layout: 'admin',
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
            res.redirect('/admin/awaitingConfirm')
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
            
            for(var i=0;i<orderDel.cart.length;i++){
                var productFind = await product.findOne({slug: orderDel.cart[i].slug})
                var upProduct = await product.updateOne({slug: orderDel.cart[i].slug},{sold: productFind.sold + orderDel.cart[i].quantityBuy})
            }
            
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
            layout: 'admin',
            orders: mutipleMongooseToObject(orders)
        })
    }

    async history(req, res, next) {
        var orders = await historyOrder.find({}).limit(20).sort({ createdAt : -1})
        res.render('historyOrderCus', {
            layout: 'admin',
            orders: mutipleMongooseToObject(orders)
        })
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
            layout: 'admin',
            total: total,
            day: strDay,
            month: month,
            year: year,
            numberDay: numberDay
        })
    }

    async revenueMonth(req, res, next) {
        var month = moment().startOf('month')
        var date = new Date()
        var numberDay = date.getDate()
        var year = date.getFullYear()

        var monthDate
        monthDate = req.query.month
        if (!monthDate) {
            monthDate = date.getMonth() + 1
        }
        if (!parseInt(monthDate) || monthDate < 1 || monthDate>12) {
            res.json('Tháng nhập vào không đúng!')
        }
        else {
            var currentDate = moment(year + '-'+(monthDate));

            // var futureMonth = moment(currentDate).subtract(1, 'M');
            // res.json(currentDate)
            var orders = await historyOrder.find({
                createdAt: {
                    $gte: currentDate.toDate(),
                    $lte: moment(currentDate).endOf('month').toDate()
                },
                state: 1
            })
            var total = 0
            for (var i = 0; i < orders.length; i++) {
                total = total + orders[i].total
            }
            res.render('revenueMonth', {
                layout: 'admin',
                total: total,
                month: monthDate,
                year: year
            })
        }
        }
    async statistics(req,res,next){
        var date = new Date()
        var year = date.getFullYear()
        var arr = []
        for(var i=1;i<=12;i++){
            var currentDate = moment(year + '-'+i)
            var orders = await historyOrder.find({
                createdAt: {
                    $gte: currentDate.toDate(),
                    $lte: moment(currentDate).endOf('month').toDate()
                },
                state: 1
            })
            var total = 0
            for (var j = 0; j < orders.length; j++) {
                total = total + orders[j].total
            }
            arr[i-1] = total
        }

        res.setHeader('total', arr)
        res.render('statistics',{
            layout: 'admin',
        })
    }

    async changeAvatar(req,res,next){
        res.render('changeAvatarAdmin',{
            layout: 'admin'
        })
    }
    async changeAvatarAdminDB(req,res,next){
        if(req.file.path){
            var image = req.file.path.split('\\').slice(2).join('/')
            image = "/" + image
            var adminId = req.signedCookies.adminId
            var result = await admin.updateOne({_id: adminId},{image:image})
            req.session.message = {
                type: 'success',
                intro: 'Cập nhật ảnh đại diện thành công!',
                message: ''
            }
        }
        else{
            req.session.message = {
                type: 'warning',
                intro: 'Cập nhật ảnh đại diện thất bại!',
                message: ''
            }
        }
        res.redirect('back')
    }


}

module.exports = new adminController();
