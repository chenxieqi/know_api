const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/topics' });
const { secret } = require('../config');
const { index, create, findAll, update, findById, checkTopicExist, topicFollowerList, topicQuestionList } = require('../controllers/topics');

const auth = jwt({ secret });

router.get('/', index);

router.post('/create', auth, create);

router.get('/list', findAll);

router.patch('/:id', auth, checkTopicExist,update);

router.get('/:id', findById);

router.get('/:id/topicFollower', checkTopicExist, topicFollowerList);

router.get('/:id/questions', checkTopicExist, topicQuestionList);

module.exports = router;