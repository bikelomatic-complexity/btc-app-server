import express from 'express';
import nano from 'nano';

import {connection} from '../db/couch';
import {ResponseBuilder} from '../api/response';

const pointsdb = connection.db.use('points');

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
router.get('/', (req, res) => {
  const builder = new ResponseBuilder().method('post');

  const moderator = req.payload.moderator;
  if(!moderator) {
    builder.status(false).message('Only admins may view points').send(res);
  }

  pointsdb.view('view', 'by_type', {limit: 10}, (err, body) => {
    // TODO: What will generate this error?
    if(err) throw err;

    const points = body.rows.map(row => row.value);
    builder.status(true).set('points', points).send(res);
  });
});
