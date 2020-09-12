/**
* name: トピック名
  avatar_url:  アイコンURL
  introduction:　紹介 
 */
const Mongoose = require('mongoose');

const { Schema, model } = Mongoose;

const topicSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  avatar_url: { type: String },
  introduction: { type: String, select:false }
}, { timestamps: true });

module.exports = model('Topic', topicSchema);