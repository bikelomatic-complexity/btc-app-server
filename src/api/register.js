import express from 'express';
import {intersection, difference, keys, pick} from 'underscore';
import nodemailer from 'nodemailer';

import {Registrant, RegistrantCollection} from '../model/registrant';
import {create} from '../token/token';
import {ResponseBuilder} from '../api/response';

const transporter = nodemailer.createTransport();

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
  const builder = new ResponseBuilder().method('post');
  const fail = builder.status(false);

  console.log(req.body);
  const needed = ['email', 'username', 'password', 'first', 'last'];
  const fields = intersection(needed, keys(req.body));
  console.log(fields);
  const missing = difference(needed, fields);
  console.log(missing);
  if(missing.length > 0) {
    fail.message('Missing ' + missing.join(', ')).send(res);
  }

  const registrant = new Registrant(pick(req.body, fields));
  const token = create(registrant);

  new Promise((resolve, reject) => {
    registrant.save({ id: token }, {
      success: (model, response, options) => {
        res.status(200).end();
        resolve(model);
      },
      error: err => {
        fail.message(err).send(res);
        reject(err);
      }
    });
  }).then(model => {

    transporter.sendMail({
      from: 'skroob@spaceballs.com',
      to: 'sk.kroh@gmail.com',
      subject: 'Activate your account with Adventure Cycling',
      text: token,
      html: `
<html>
  <body>
    <a href='http://localhost:8080/api/register/confirm?token=${token}'>Click to activate</a>
  </body>
</html>`
    });

  }).catch(err => {
      console.log('bloop');
  });
});
