const User = require('../models/users');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');

class Userctl {
  index(ctx) {
    ctx.body = 'this is user page';
  }
  async findAllUsers(ctx) {
    ctx.body = await User.find();
  }
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
  async findById(ctx) {
    const id = ctx.params.id;
    const { fileds } = ctx.query;
    const selectedFiled = fileds.split(';').filter(f => f).map(f => ' +' + f).join('');
    const user = await User.findById(id).select(selectedFiled);
    if (!user) { ctx.throw(404, 'no such user') };
    ctx.body = user;
  }
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) { ctx.throw(403, 'forbidden'); }
    await next();
  }
}

module.exports = new Userctl();