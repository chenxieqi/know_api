/**
* name: ユーザー名
  password: パスワード
  avatar_url:  アイコンURL
  gender: 性別
  introduction:　自己紹介 
  locations: 所在地
  business: 業界
  educations: 学歴
    school: 学校
    major: 専門
    diploma: 学位
  following: フォロー
 */
const Mongoose = require('mongoose');

const { Schema, model } = Mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male', required: true },
  introduction: { type: String },
  locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },
  business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
  educations: {
    type: [{
      school: { type: Schema.Types.ObjectId, ref: 'Topic' },
      major: { type: Schema.Types.ObjectId, ref: 'Topic' },
      diploma: { type: Number, enum: [1, 2, 3, 4, 5] }
    }], select: false
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false
  },
  followingTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  }
});

module.exports = model('User', userSchema);