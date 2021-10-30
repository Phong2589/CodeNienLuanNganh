const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facebook = new Schema({
    idFace: { type: String, unique: true},
    user: { type: String},
    image: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('facebook', facebook);