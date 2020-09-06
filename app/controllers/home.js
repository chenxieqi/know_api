const path = require('path');

class Homectl{
  index(ctx){
    ctx.body = 'this is home page';
  }
  upload(ctx){
    const file = ctx.request.files.file;
    const basename = path.basename(file.path);
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` };// ctx.origin->localhost:3000
  }
}

module.exports = new Homectl();