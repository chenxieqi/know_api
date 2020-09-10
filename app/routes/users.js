const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const { index, create, findAll, login, 
        update, checkOwner, findById, checkUserExist,
        followingList, follow, unfollow, followerList, 
        followingTopicList, followTopic, unfollowTopic, listQuestions, 
        followingQuestionList, followQuestion, unfollowQuestion,
        listLikingAnswers, likingAnswer, cancelLikingAnswer, dislikingAnswer, cancelDislikingAnswer, listdisLikingAnswers,
        listCollectingAnswers,
        collectingAnswer,
        cancelCollectingAnswer, } = require('../controllers/users');
const { checkAnswerer } = require('../controllers/answers');
const { checkTopicExist } = require('../controllers/topics');
const { checkQuestionExist } = require('../controllers/questions');
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

router.get('/list', findAll);

router.post('/login', login);

router.patch('/:id', auth, checkOwner, update);

router.get('/:id', findById);

router.get('/:id/following', followingList);

router.get('/:id/follower', followerList);

router.post('/following/:id', auth, checkUserExist, follow);

router.delete('/following/:id', auth, checkUserExist, unfollow);

router.get('/:id/followingTopicList', followingTopicList);

router.post('/followingTopic/:id', auth, checkTopicExist, followTopic);

router.delete('/followingTopic/:id', auth, checkTopicExist, unfollowTopic);

router.get('/:id/followingQuestionList', followingQuestionList);

router.post('/followingQuestion/:id', auth, checkQuestionExist, followQuestion);

router.delete('/followingQuestion/:id', auth, checkQuestionExist, unfollowQuestion);

router.get('/:id/questions', listQuestions);

router.get('/:id/likingAnswerList', listLikingAnswers);

router.post('/likingAnswer/:id', auth, checkAnswerer, likingAnswer, cancelDislikingAnswer);

router.delete('/likingAnswer/:id', auth, checkAnswerer, cancelLikingAnswer);

router.get('/:id/dislikingAnswerList', listdisLikingAnswers);

router.post('/dislikingAnswer/:id', auth, checkAnswerer, dislikingAnswer, cancelLikingAnswer);

router.delete('/dislikingAnswer/:id', auth, checkAnswerer, cancelDislikingAnswer);

router.get('/:id/collectingAnswerList', listCollectingAnswers);

router.post('/collectingAnswer/:id', auth, checkAnswerer, collectingAnswer);

router.delete('/collectingAnswer/:id', auth, checkAnswerer, cancelCollectingAnswer);

module.exports = router;