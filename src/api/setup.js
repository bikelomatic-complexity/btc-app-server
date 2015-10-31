import {Router} from 'express';
import {connection} from '../db/couch';
import {ResponseBuilder} from '../api/response';

const users = connection.db.use('users');

/**
 * The authentication router's root allows the client to obtain a JWT for
 * use with all subsequent api calls.
 * @todo authenticate with OAuth providers
 */
export const router = Router();

/**
 * Issuing a GET request to the setup route will insert default data into
 * the database for testing purposes.
 */
router.get('/', (req, res) => {
  const users = [ {
    name: 'Barry Allen',
    password: 'flash',
    admin: true
  }, {
    name: 'Oliver Queen',
    password: 'arrow',
    admin: false
  }, {
    name: 'Selina Kyle',
    password: 'catwoman',
    admin: false
  } ];

  db.save(bulk, { 'all_or_nothing': true }, (err, body) => {
    const builder = new ResponseBuilder().method('GET');
    builder.success(true).send(res);
  });
});
