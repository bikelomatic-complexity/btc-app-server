import express from 'express';
import nano from 'nano';

import {connection} from '../db/couch';
import {create} from '../token/token';
import {ResponseBuilder} from '../api/response';

const users = connection.db.use('users');

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
  users.view('auth', 'by_email', {keys: [email], limit: 1}, (err, body) => {
    const builder = new ResponseBuilder().method('post');
    const fail = builder.status(false).message('Authenticaiton failed: ');

    // TODO: What will generate this error?
    if(err) throw err;

    const [user,] = body.rows;
    if(!user) {
      fail.message('email not in system').send(res);
    } else {
      if(user.value !== password) {
        fail.message('wrong password').send(res);
      } else {
        // If user is found and password is right, create a token
        create(user.id).then(token => {
          builder.status(true).set('token', token).send(res);
        }, err => {
          fail.message(err).send(res);
        });
      }
    }
  });
});
