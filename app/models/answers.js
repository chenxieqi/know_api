/**
* content: 答え内容
  answerer:  答え者
  questionerId:　質問Id
  voteCount: いいねされた回数
 */
const Mongoose = require('mongoose');

const { Schema, model } = Mongoose;

const answerSchema = new Schema({
  __v: { type: Number, select: true },
  content: { type: String, required: true },
  answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: String, required: true },
  voteCount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = model('Answer', answerSchema);