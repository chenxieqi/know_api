const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const { index, create, findAllUsers, login, 
        update, checkOwner, findById, checkUserExist,
        followingList, follow, unfollow, followerList } = require('../controllers/users');
const { secret } = require('../config');

// auth using jsonwebtoken
// const auth = async( ctx,next )=>{
//   const { authorization='' } = ctx.request.header;
//   const token = authorization.replace('Bearer ','');
//   try {
//     const user = jsonwebtoken.verify(token,secret);
//     // save user info for next process
//     ctx.state.user = user;
//   } catch (error) {
//     ctx.throw( 401,error.message );
//   }
//   await next();
// }

const auth = jwt({ secret });

router.get('/', index);

router.post('/create', create);

router.get('/list', findAllUsers);

router.post('/login', login);

router.patch('/:id', auth, checkOwner, update);

router.get('/:id', findById);

router.get('/:id/following', followingList);

router.get('/:id/follower', followerList);

router.post('/following/:id', auth, checkUserExist, follow);

router.delete('/following/:id', auth, checkUserExist, unfollow);

module.exports = router;