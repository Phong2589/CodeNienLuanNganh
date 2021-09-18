const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    name: { type: String},
    cost: { type: Number},
    image: {type: String},
    description: {type: String},
    quantity: {type: Number}
  },{
    timestamps: true,
  });

module.exports = mongoose.model('product', product);