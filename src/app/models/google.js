const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const google = new Schema({
    email: { type: String, unique: true},
    user: { type: String},
    image: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('google', google);