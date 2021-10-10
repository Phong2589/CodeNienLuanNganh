const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order = new Schema({
    idcus: {type: String},
    name: { type: String},
    phone: { type: String},
    address: { type: String},
    note: { type: String},
    cart: {type: Array},
    total: {type: Number}
  },{
    timestamps: true,
  });

module.exports = mongoose.model('order', order);