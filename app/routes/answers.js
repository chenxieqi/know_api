const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/questions/:questionId/answers' });
const { secret } = require('../config');
const { create, findAll, update, findById, checkAnswerExist, checkAnswerer,delete:del} = require('../controllers/answers');

const auth = jwt({ secret });

router.post('/create', auth, create);

router.get('/list', findAll);

router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update);

router.get('/:id', findById);

router.delete('/:id',  checkAnswerExist, checkAnswerer,del);

module.exports = router;