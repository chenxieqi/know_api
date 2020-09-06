const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const Mongoose = require('mongoose');
const path = require('path')
const app = new Koa();
const error = require('koa-json-error');
const paramater = require('koa-parameter');
const routing = require('./routes');
const {connectionStr} = require('./config');

Mongoose.connect(connectionStr,{ useNewUrlParser: true ,useUnifiedTopology: true});
Mongoose.connection.on('connected',()=>console.log('connected'));
Mongoose.connection.on('error',console.error);

app.use(koaStatic(path.join(__dirname,'public')));
app.use(koaBody({
  multipart:true,
  formidable:{
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true
  }
}));
app.use(paramater(app));
app.use(error({
  postFormat: (err,{stack,...rest})=>process.env.NODE_ENV === 'production' ? rest : {stack,...rest}
}));


routing(app);


app.listen(3000,() => { console.log('server on') });



// ctx -> context
// app.use(async (ctx,next)=>{
//   await next();
//   console.log(1);
//   ctx.body = 'hello worldwww';
// })

// app.use(async (ctx)=>{
//   console.log(2);
// })
