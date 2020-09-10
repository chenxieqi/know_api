/**
 * 答えAPI
 */
const Answer = require('../models/answers');
const { secret } = require('../config');

class AnswerCtl {
  // 存在チェック
  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+Answerer');
    if (!answer) { ctx.throw(404, 'Answer does not exist'); }
    if ( answer.questionId !== ctx.params.questionId ){ ctx.throw(404,'Answer does not exist in this question')}
    ctx.state.answer = answer;
    await next();
  }
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const answerer = ctx.state.user._id;
    const { questionId } = ctx.params;
    const answer = await new Answer({...ctx.request.body, answerer, questionId}).save();
    ctx.body = answer;
  }
  async checkAnswerer(ctx,next){
    const { answer } = ctx.state;
    // ctx.params.questionId => ルーターが答えの場合だけ答え者をチェックする
    if( ctx.params.questionId && answer.answerer.toString() !== ctx.state.user._id ){ctx.throw(403,'do not has the authority')}
    await next(); 
  }
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false }
    })
    await ctx.state.answer.update({...ctx.request.body});
    ctx.body = ctx.state.answer;
  }
  async findById(ctx) {
    const answer = await Answer.findById(ctx.params.id).populate('answerer');
    if (!answer) { ctx.throw(404, 'Answer does not exist'); }
    ctx.body = answer;
  }
  async findAll(ctx) {
    const { per_page = 10, page = 1 } = ctx.query;
    const setPage = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Answer.find({ $or: [{content: q},{questionId: ctx.params.questionId }] }).limit(perPage).skip(setPage * perPage);
  }
  async delete(ctx){
    await Answer.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new AnswerCtl();