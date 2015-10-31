import jwt from 'jsonwebtoken';
import _ from 'underscore';

import {connection} from '../db/couch.js'

const users = connection.db.use('users');
const secret = 'secret';

export function createToken(user) {
  const token = jwt.sign(user.tokenize(), secret, {
    expiresIn: '15m',
    algorithm: 'HS256',
    issuer: 'localhost',
    subject: (user.moderator ? 'moderator' : 'cyclist') + 'token'
  });
  return token;

  // return new Promise((resolve, reject) => {
  //   users.get(user_doc_id, { revs_info: false }, (err, user) => {
  //     if(err) reject(err);
  //
  //     const token = jwt.sign(_(user).pick(["email", "moderator"]), secret, {
  //       expiresIn: '15m',
  //       algorithm: 'HS256',
  //       issuer: 'example.com',
  //       subject: 'user api token'
  //     });
  //
  //     resolve(token);
  //   });
  // });
}

export function verify(req, res, next) {
  const token = req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, secret, (err, decoded) => {
      if(err) {
        return res.json({success: false, message: 'Failed to authenticate'});
      } else {
        req.payload = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
}
