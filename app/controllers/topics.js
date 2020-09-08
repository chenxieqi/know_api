/**
 * トピックAPI
 */
const Topic = require('../models/topics');
const User = require('../models/users');
const { secret } = require('../config');

class TopicsCtl {
  index(ctx) {
    ctx.body = 'this is topic page';
  }
  // トピック存在チェック
  async checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id);
    if (!topic) { ctx.throw(404, 'topic does not exist'); }
    await next();
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const { name } = ctx.request.body;
    const repeatedTopic = await Topic.findOne({ name });
    if (repeatedTopic) { ctx.throw(409, 'topic name is already been used'); }
    const topic = await (await Topic.create(ctx.request.body)).save();
    ctx.body = topic;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!topic) { ctx.throw(401, 'update failed'); }
    ctx.body = topic;
  }
  async findById(ctx) {
    const id = ctx.params.id;
    const { fileds = '' } = ctx.query;
    const selectedFileds = fileds.split(';').filter(f => f).map(f => ' +' + f).join('');
    const topic = await Topic.findById(ctx.params.id).select(selectedFileds);
    if (!topic) { ctx.throw(404, 'topic does not exist'); }
    ctx.body = topic;
  }
  async findAll(ctx) {
    const { per_page = 10, page = 1 } = ctx.query;
    const setPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip(setPage * perPage);
  }
  async topicFollowerList(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id });
    ctx.body = users;
  }
}

module.exports = new TopicsCtl();