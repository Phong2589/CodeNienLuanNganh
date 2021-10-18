
const customer = require('../models/customer')
const product = require('../models/product')
const order = require('../models/order')
const cart = require('../models/cart')
const profileCustomer = require('../models/profileCustomer')
const ShortUniqueId = require('short-unique-id')
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')
const { find, findOne } = require('../models/customer')
const historyOrder = require('../models/historyOrder')

const uid = new ShortUniqueId({ length: 10 })

class customerController {
    async customer(req, res, next) {
        var products = await product.find({ quantity: { $gte: 1 } })
        res.render('homeCustomer', {
            layout: 'customer',
            products: mutipleMongooseToObject(products),
        })
    }

    async decreaseProductToCart(req, res, next) {
        var slug = req.params.slug
        var cusId = req.signedCookies.cusId
        if (!cusId) {
            res.json('Lỗi! Không thể thể giảm sô lượng sản phẩm trong giỏ hàng!')
            return
        }
        try {
            var cartElement = await cart.findOne({ cusId: cusId })
            var quantity = 0, cartup;
            if (cartElement) {
                for (var i = 0; i < cartElement.cart.length; i++) {
                    quantity = quantity + cartElement.cart[i].quantityBuy;
                }

                for (var i = 0; i < cartElement.cart.length; i++) {
                    if (cartElement.cart[i].slug == slug) {

                        cartElement.cart[i].quantityBuy = cartElement.cart[i].quantityBuy - 1
                        cartElement.cart[i].totalItem = cartElement.cart[i].quantityBuy * cartElement.cart[i].cost
                        cartElement.total = cartElement.total - cartElement.cart[i].cost
                        cartup = await cart.updateOne({ cusId: cusId }, { cart: cartElement.cart, total: cartElement.total })
                        break
                    }
                }
            }
            quantity -= 1;
            res.json(quantity)
        }
        catch (error) {
            res.json(error)
        }
    }

    async deleteProductFromCart(req, res, next) {
        var slug = req.params.slug
        var cusId = req.signedCookies.cusId
        if (!cusId) {
            res.send('Lỗi! Không thể thể giảm sô lượng sản phẩm trong giỏ hàng!')
            return
        }
        try {
            var cartElement = await cart.findOne({ cusId: cusId })
            var cartup, index = 0
            if (cartElement) {
                for (var i = 0; i < cartElement.cart.length; i++) {
                    if (cartElement.cart[i].slug == slug) {
                        index = i
                        break
                    }
                }
                cartElement.total = cartElement.total - cartElement.cart[index].totalItem
                cartElement.cart.splice(index, 1)

                cartup = await cart.updateOne({ cusId: cusId }, { cart: cartElement.cart, total: cartElement.total })
            }
            res.redirect('back')
        }
        catch (error) {
            res.json(error)
        }
    }

    async changeProductFromCart(req, res, next) {
        var slug = req.params.slug
        var quantityGet = req.query.quantity
        var quantity = parseInt(quantityGet)
        var cusId = req.signedCookies.cusId
        if (!cusId) {
            res.send('Lỗi! Không thể thể giảm sô lượng sản phẩm trong giỏ hàng!')
            return
        }
        try {
            var cartElement = await cart.findOne({ cusId: cusId })
            var cartup, total, totalItemOld, totalItemNew
            if (cartElement) {
                for (var i = 0; i < cartElement.cart.length; i++) {
                    if (cartElement.cart[i].slug == slug) {
                        totalItemOld = cartElement.cart[i].totalItem
                        cartElement.cart[i].quantityBuy = quantity
                        cartElement.cart[i].totalItem = cartElement.cart[i].cost * cartElement.cart[i].quantityBuy
                        totalItemNew = cartElement.cart[i].totalItem
                        break
                    }
                }
                cartElement.total = cartElement.total + (totalItemNew - totalItemOld)
                cartup = await cart.updateOne({ cusId: cusId }, { cart: cartElement.cart, total: cartElement.total })
            }
            res.redirect('back')
        }
        catch (error) {
            res.json(error)
        }
    }

    async order(req, res, next) {
        try {
            const orderNew = new order()
            orderNew.cusId = req.signedCookies.cusId
            orderNew.orderId = uid()
            orderNew.name = req.body.name
            orderNew.phone = req.body.phone
            orderNew.address = req.body.address
            orderNew.note = req.body.note
            var cartElement = await cart.findOne({ cusId: req.signedCookies.cusId })
            orderNew.cart = cartElement.cart
            orderNew.total = cartElement.total
            orderNew.state = 0
            var result = await orderNew.save()
            for (var i = 0; i < cartElement.cart.length; i++) {
                var quantityUpdate = cartElement.cart[i].quantity - cartElement.cart[i].quantityBuy
                var resultUpdate = await product.updateOne({ slug: cartElement.cart[i].slug }, { quantity: quantityUpdate })
            }
            var arrayCart = []
            var reasultCart = await cart.updateOne({ cusId: req.signedCookies.cusId }, { cart: arrayCart, total: 0 })
            req.session.message = {
                type: 'success',
                intro: 'Chúc mừng bạn đã đặt đơn hàng thành công!',
                message: ''
            }
            res.redirect('/customer')
        }
        catch (error) {
            res.json(error)
        }
    }
    async profile(req, res, next) {
        var cusId = req.signedCookies.cusId
        var findProfile = await profileCustomer.findOne({ cusId: cusId })
        res.render('profileCustomer', {
            layout: 'customer',
            profile: MongooseToObject(findProfile),
        })
    }

    async profileProcess(req, res, next) {
        var cusId = req.signedCookies.cusId
        var findProfile = await profileCustomer.findOne({ cusId: cusId })
        if (findProfile) {
            var resultOld = await profileCustomer.updateOne({ usId: cusId }, {
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                note: req.body.note
            })
        }
        else {
            const profileCusNew = new profileCustomer(req.body)
            profileCusNew.note = ''
            profileCusNew.cusId = cusId
            var resultNew = await profileCusNew.save()
        }
        req.session.message = {
            type: 'success',
            intro: 'Chúc mừng bạn đã cập nhật thông tin thành công!',
            message: ''
        }
        res.redirect('back')
    }

    async orderNow(req, res, next) {

        var cusId = req.signedCookies.cusId
        var slug = req.params.slug
        var productBuy = await product.findOne({ slug: slug })
        var profile = await profileCustomer.findOne({ cusId: cusId })
        res.render('orderNow', {
            layout: 'customer',
            product: MongooseToObject(productBuy),
            profile: MongooseToObject(profile),

        })
    }

    async orderNowCustomer(req, res, next) {
        var cusId = req.signedCookies.cusId
        var slug = req.params.slug
        const orderNew = new order()
        orderNew.cusId = cusId
        orderNew.orderId = uid()
        orderNew.name = req.body.name
        orderNew.phone = req.body.phone
        orderNew.address = req.body.address
        orderNew.note = req.body.note
        orderNew.state = 0

        var quantityBuy = parseInt(req.body.quantityBuy)
        var productBuy = await product.findOne({ slug: slug })
        orderNew.cart[0] = {
            name: productBuy.name,
            cost: productBuy.cost,
            image: productBuy.image,
            description: productBuy.description,
            quantity: productBuy.quantity,
            slug: slug,
            quantityBuy: quantityBuy,
            totalItem: quantityBuy * productBuy.cost
        }
        orderNew.total = quantityBuy * productBuy.cost
        var resultSave = await orderNew.save()
        var resultUpdate = await product.updateOne({ slug: slug }, { quantity: productBuy.quantity - quantityBuy })
        req.session.message = {
            type: 'success',
            intro: 'Chúc mừng bạn đã đặt hàng thành công!',
            message: ''
        }
        res.redirect('/customer')
    }
    async sortaz(req, res, next) {
        var products = await product.find().sort({ "name": 1 })
        res.render('homeCustomer', {
            layout: 'customer',
            products: mutipleMongooseToObject(products),
        })
    }
    async sortza(req, res, next) {
        var products = await product.find().sort({ "name": -1 })
        res.render('homeCustomer', {
            layout: 'customer',
            products: mutipleMongooseToObject(products),
        })
    }
    async sortCostDecrease(req, res, next) {
        var products = await product.find().sort({ "cost": -1 })
        res.render('homeCustomer', {
            layout: 'customer',
            products: mutipleMongooseToObject(products),
        })
    }
    async sortCostIncrease(req, res, next) {
        var products = await product.find().sort({ "cost": 1 })
        res.render('homeCustomer', {
            layout: 'customer',
            products: mutipleMongooseToObject(products),
        })
    }
    async search(req, res, next) {
        var products = await product.find({ $text: { $search: req.query.search } })
        if (products) {
            res.render('homeCustomer', {
                layout: 'customer',
                products: mutipleMongooseToObject(products),
            })
        }
        else {
            res.render('homeCustomer', {
                layout: 'customer',
            })
        }
    }
    logOut(req, res, next) {
        res.clearCookie("cusId")
        res.redirect('/')
    }
    async awaitingConfirm(req, res, next) {
        var cusId = req.signedCookies.cusId
        var orders = await order.find({ cusId: cusId, state: 0 })
        res.render('awaitingConfirm', {
            layout: 'customer',
            orders: mutipleMongooseToObject(orders)
        })
    }
    async cancelOrder(req, res, next) {
        try {
            var orderId = req.params.orderId
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
            var del = await order.deleteOne({orderId: orderId})
            res.send('success')
        }
        catch (error) {
            res.json(error)
        }
    }
    async confirmed(req, res, next){
        var cusId = req.signedCookies.cusId
        var orders = await order.find({ cusId: cusId, state: 1 })
        res.render('confirmed', {
            layout: 'customer',
            orders: mutipleMongooseToObject(orders)
        })
    }
}

module.exports = new customerController();
