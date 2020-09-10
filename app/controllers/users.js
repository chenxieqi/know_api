/**
 * ユーザーAPI
 */
const User = require('../models/users');
const Topic = require('../models/topics');
const Question = require('../models/questions');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');

class UsersCtl {
  index(ctx) {
    ctx.body = 'this is user page';
  }
  // ユーザーリスト
  async findAll(ctx) {
    const { per_page = 10, page = 1 } = ctx.query;
    const setPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip(setPage * perPage);
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
    if (!user) { ctx.throw(401, 'update failed'); }
    ctx.body = ctx.request.body;
  }
  // ユーザー検索
  async findById(ctx) {
    const id = ctx.params.id;
    const { fileds = '' } = ctx.query;
    const selectedFiled = fileds.split(';').filter(f => f).map(f => ' +' + f).join('');
    const populateStr = fileds.split(';').filter(f => f).map(f => {
      if (f === 'educations') {
        return 'educations.school educations.major';
      }
      return f;
    }).join(' ');
    const user = await User.findById(id).select(selectedFiled).populate(populateStr);
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
  // トピックフォローリスト
  async followingTopicList(ctx) {
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics');
    if (!user) { ctx.throw(404); }
    ctx.body = user.followingTopics;
  }
  // トピックフォロー
  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics');
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }
  // トピックフォロー解除
  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics');
    const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 質問フォローリスト
  async followingQuestionList(ctx) {
    const user = await User.findById(ctx.params.id).select('+followingQuestions').populate('followingQuestions');
    if (!user) { ctx.throw(404); }
    ctx.body = user.followingQuestions;
  }
  // 質問フォロー
  async followQuestion(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingQuestions');
    if (!me.followingQuestions.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingQuestions.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }
  // 質問フォロー解除
  async unfollowQuestion(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingQuestions');
    const index = me.followingQuestions.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.followingQuestions.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 質問リスト
  async listQuestions(ctx) {
    const questions = await Question.find({ questioner: ctx.params.id });
    if (!questions) { ctx.throw(404, 'questions not found'); }
    ctx.body = questions;
  }
  // いいねした答えリスト
  async listLikingAnswers(ctx) {
    const likingAnswers = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers');
    if (!likingAnswers) { ctx.throw(404, 'Liking answers not found'); }
    ctx.body = likingAnswers;
  }
  // 答えにいいねする
  async likingAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      me.save();
      await Question.findByIdAndUpdate(ctx.params.id,{ $inc: {voteCount: 1}});
    }
    ctx.status = 204;
    await next();
  }
  // 答えのいいねをキャンセルする
  async cancelLikingAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
      await Question.findByIdAndUpdate(ctx.params.id,{ $inc: {voteCount: -1}});
    }
    ctx.status = 204;
  }
  // ディスした答えリスト
  async listdisLikingAnswers(ctx) {
    const dislikingAnswers = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');
    if (!dislikingAnswers) { ctx.throw(404, 'Disliking answers not found'); }
    ctx.body = dislikingAnswers;
  }
  // 答えにディスする
  async dislikingAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
    if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.dislikingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  // 答えのディスをキャンセルする
  async cancelDislikingAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
    const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 答えコレクションリスト
  async listCollectingAnswers(ctx) {
    const collectingAnswers = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers');
    if (!collectingAnswers) { ctx.throw(404, 'collecting answers not found'); }
    ctx.body = collectingAnswers;
  }
  // 答えに保存する
  async collectingAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
    if (!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.collectingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  // 答えの保存をキャンセルする
  async cancelCollectingAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
    const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.collectingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}

module.exports = new UsersCtl();