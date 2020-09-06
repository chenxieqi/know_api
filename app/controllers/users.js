/**
 * ユーザーAPI
 */
const User = require('../models/users');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');
const users = require('../models/users');

class Userctl {
  index(ctx) {
    ctx.body = 'this is user page';
  }
  // ユーザーリスト
  async findAllUsers(ctx) {
    ctx.body = await User.find();
  }
  // 新規
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) { ctx.throw(409, 'user name is already been used'); }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  // ログイン
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) { ctx.throw(401, 'Cant find name or password'); }
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
    ctx.body = { token };
  }
  // 編集
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
      business: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
    });
    const user = await User.findOneAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) { ctx.throw(401, 'cant update'); }
    ctx.body = ctx.request.body;
  }
  // ユーザー検索
  async findById(ctx) {
    const id = ctx.params.id;
    const { fileds } = ctx.query;
    const selectedFiled = fileds.split(';').filter(f => f).map(f => ' +' + f).join('');
    const user = await User.findById(id).select(selectedFiled);
    if (!user) { ctx.throw(404, 'user does not exist') };
    ctx.body = user;
  }
  // ユーザー認証
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) { ctx.throw(403, 'forbidden'); }
    await next();
  }
  // ユーザー存在チェック
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) { ctx.throw(404, 'user does not exist'); }
    await next();
  }
  // フォローリスト
  async followingList(ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following');
    if (!user) { ctx.throw(404); }
    ctx.body = user.following;
  }
  // フォロワーリスト
  async followerList(ctx) {
    const users = await User.find({ following: ctx.params.id });
    ctx.body = users;
  }
  // フォロー
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }
  // フォロー解除
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}

module.exports = new Userctl();