const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/questions' });
const { secret } = require('../config');
const { create, findAll, update, findById, checkQuestionExist, checkQuestioner,delete:del} = require('../controllers/questions');

const auth = jwt({ secret });

router.post('/create', auth, create);

router.get('/list', findAll);

router.patch('/:id', auth, checkQuestionExist, checkQuestioner,update);

router.get('/:id', findById);

router.delete('/:id',  checkQuestionExist, checkQuestioner,del);


module.exports = router;