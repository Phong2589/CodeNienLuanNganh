const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const product = new Schema({
    name: { type: String},
    cost: { type: Number},
    image: {type: String},
    description: {type: String},
    quantity: {type: Number},
    slug: { type: String, slug: 'name', unique: true },
    sold: {type: Number},
  },{
    timestamps: true,
  });
  product.index({ name : 'text'})

mongoose.plugin(slug);
product.plugin(mongooseDelete, { 
  deletedAt : true,
  overrideMethods: 'all' 
});

module.exports = mongoose.model('product', product);