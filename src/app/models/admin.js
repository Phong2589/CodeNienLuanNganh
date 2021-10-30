const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema({
    user: { type: String, unique: true},
    password: { type: String},
    image: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('admin', admin);