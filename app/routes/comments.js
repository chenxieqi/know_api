const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' });
const { secret } = require('../config');
const { create, findAll, update, findById, checkCommentExist, checkCommentator,delete:del} = require('../controllers/comments');

const auth = jwt({ secret });

router.post('/create', auth, create);

router.get('/list', findAll);

router.patch('/:id', auth, checkCommentExist, checkCommentator, update);

router.get('/:id', findById);

router.delete('/:id',  checkCommentExist, checkCommentator,del);

module.exports = router;