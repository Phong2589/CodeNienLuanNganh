const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order = new Schema({
    cusId: {type: String},
    orderId: {type: String, unique: true},
    name: { type: String},
    phone: { type: String},
    address: { type: String},
    note: { type: String},
    cart: {type: Array},
    total: {type: Number},
    state: {type: Number}
  },{
    timestamps: true,
  });

module.exports = mongoose.model('order', order);