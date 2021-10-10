const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = new Schema({
    sessionID: { type: String},
    cart: {type: Array},
    total: {type: Number},
    cusId: {type: String}
  },{
    timestamps: true,
  });

module.exports = mongoose.model('cart', cart);