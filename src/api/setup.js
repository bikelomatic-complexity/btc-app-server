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
  const docs = {docs: [ {
    name: 'Barry Allen',
    email: 'barry@example.com',
    password: 'flash',
    admin: true
  }, {
    name: 'Oliver Queen',
    email: 'ollie@example.com',
    password: 'arrow',
    admin: false
  }, {
    name: 'Selina Kyle',
    email: 'kat@example.com',
    password: 'catwoman',
    admin: false
  } ] };

  users.bulk(docs, { 'all_or_nothing': true }, (err, body) => {
    res.status(200).end();
  });
});
