const router = require('express').Router();
import {promisify} from '../../../shared/utils/index';
import {server$oauthVKRegister} from '../../actions/oauth';
import OAuth from 'oauth';

const makeRedirectUri = (type, req) => {
  const protocol = req.headers['x-forwarded-proto'];
  const host = req.headers.host;

  return `${protocol}://${host}/api/oauth/${type}`;
};

router.get('/vk', function (req, res, next) {
  req.app.get('store').dispatch(server$oauthVKRegister(makeRedirectUri('vk', req), req.query.code))
  // .then((token) => {
  //   console.log('redirecting')
  //   console.log('/login?token=' + token)
  //   return token;
  // })

    .then((token) => res.redirect('/login?token=' + token))
    .catch(err => res.redirect('/login?error=' + err));
});

const twitterApi = new OAuth.OAuth(
  'https://twitter.com/oauth/request_token'
  , 'https://twitter.com/oauth/access_token'
  , process.env.TWITTER_CONSUMER_KEY
  , process.env.TWITTER_CONSUMER_SECRET
  , '1.0A'
  , 'http://localhost:2000/api/oauth/twitter'
  , 'HMAC-SHA1'
);
console.log(process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET);

const promiseOAuthRequestToken = promisify(twitterApi.getOAuthAccessToken);

router.get('/twitter-test', function (req, res, next) {
  console.log(process.env.TWITTER_ACCESS_TOKEN_KEY, process.env.TWITTER_ACCESS_TOKEN_SECRET)

  twitterApi.getOAuthAccessToken(
    process.env.TWITTER_ACCESS_TOKEN_KEY, process.env.TWITTER_ACCESS_TOKEN_SECRET
    , (error, data) => {

      if (error) {
        console.error('ERRORR', error, data)
        res.send("Error getting OAuth request token : ", 500);
      } else {
        // req.session.oauthRequestToken = oauthToken;
        // req.session.oauthRequestTokenSecret = oauthTokenSecret;
        console.log('GOOD', error, data)
        res.send('GOOD');
      }
    })
  // promiseOAuthRequestToken.call(twitterApi
  //   , process.env.TWITTER_ACCESS_TOKEN_KEY
  //   , process.env.TWITTER_ACCESS_TOKEN_SECRET
  // )
  //   .then((d) => {
  //     console.log(d);
  //     res.json(d);
  //   })
  //   .catch((e) => {
  //     console.error(e);
  //     res.json(e);
  //   })
  // req.app.get('store').dispatch(server$oauthVKRegister(req.headers['x-forwarded-proto'], req.headers.host, req.query.code))
  //   .then((token) => res.redirect('/login?token=' + token))
  //   .catch(err => res.redirect('/login?error=' + err));
});

export default router;