/**
* title: 質問タイトル
  description:  質問内容
  questioner:　質問者
 */
const Mongoose = require('mongoose');

const { Schema, model } = Mongoose;

const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String },
  questioner: { 
    type: [{type: Schema.Types.ObjectId, ref: 'User'}], 
    required:true, 
    select:false },
  topics: { 
    type: [{type: Schema.Types.ObjectId, ref: 'Topic'}], 
    select:false }
}, { timestamps: true });

module.exports = model('Question', questionSchema);