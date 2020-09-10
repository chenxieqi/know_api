/**
 * 質問API
 */
const Question = require('../models/questions');
const { secret } = require('../config');

class QuestionCtl {
  // 存在チェック
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner');
    if (!question) { ctx.throw(404, 'question does not exist'); }
    ctx.state.question = question;
    await next();
  }
  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false }
    })
    const question = await new Question({...ctx.request.body,questioner: ctx.state.user._id}).save();
    ctx.body = question;
  }
  async checkQuestioner(ctx,next){
    const { question } = ctx.state;
    if( question.questioner.toString() !== ctx.state.user._id ){ctx.throw(403,'do not has the authority')}
    await next(); 
  }
  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false }
    })
    await ctx.state.question.update(ctx.request.body);
    ctx.body = ctx.state.question;
  }
  async findById(ctx) {
    const question = await Question.findById(ctx.params.id).populate('questioner topics');
    if (!question) { ctx.throw(404, 'question does not exist'); }
    ctx.body = question;
  }
  async findAll(ctx) {
    const { per_page = 10, page = 1 } = ctx.query;
    const setPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Question.find({ $or: [{title: q},{description: q }] }).limit(perPage).skip(setPage * perPage);
  }
  async delete(ctx){
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new QuestionCtl();