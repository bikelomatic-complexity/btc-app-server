import express from 'express';

import {User, UserCollection} from '../model/user';
import {create} from '../token/token';
import {ResponseBuilder} from '../api/response';

/**
 * The authentication router's root allows the client to obtain a JWT for
 * use with all subsequent api calls.
 * @todo authenticate with OAuth providers
 */
export const router = express.Router();

/**
 * @example
 * POST /api/authenticate
 * {
 *   "email": "skroob@spaceballs.com",
 *   "password": "123456"
 * }
 * Response:
 * {
 *   "token": "aaaaaaaaaa.bbbbbbbbbbb.cccccccccccc"
 * }
 */
router.post('/', (req, res) => {
  const {email, password} = req.body;

  const builder = new ResponseBuilder().method('post');
  const fail = builder.status(false).message('Authentication failed: ');

  new User({ 'email': email }).fetch({
    success: user => {
      // If user is found and password is right, create a token
      if(user.matches({ 'password': password })) {
        builder.status(true).set('token', create(user)).send(res);
      } else {
        fail.message('wrong password').send(res);
      }
    },
    error: err => {
      fail.message('email not in system').send(res);
    }
  });
});
