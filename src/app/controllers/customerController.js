
const customer = require('../models/customer')
const product = require('../models/product')
const order = require('../models/order')
const cart = require('../models/cart')


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
    
    order(req,res,next){
        const orderNew = new order(req.body)
        orderNew.save()
        res.render('orderSuccess',{
            layout: 'customer',
        })
    }
}

module.exports = new customerController();
