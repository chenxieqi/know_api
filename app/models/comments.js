/**
* content: コメント内容
  commentator:  コメント者
  questionerId:　質問Id
  answerId: 答えId
 */
const Mongoose = require('mongoose');

const { Schema, model } = Mongoose;

const commentSchema = new Schema({
  __v: { type: Number, select: true },
  content: { type: String, required: true },
  commentator: { type: Schema.Types.ObjectId, ref: 'User', required:true },
  questionId: { type: String, required:true},
  answerId: { type: String, required:true},
  rootCommentId: { type: String},
  replyTo: { type: Schema.Types.ObjectId, ref: 'User'},
}, { timestamps: true });

module.exports = model('Comment', commentSchema);