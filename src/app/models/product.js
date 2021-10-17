const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const product = new Schema({
    name: { type: String},
    cost: { type: Number},
    image: {type: String},
    description: {type: String},
    quantity: {type: Number},
    slug: { type: String, slug: 'name', unique: true }
  },{
    timestamps: true,
  });
  product.index({ name : 'text'})
module.exports = mongoose.model('product', product);