
// import Backbone, { Model, Collection } from 'backbone';
// import { sync } from 'backbone-pouch';
// import PouchDB from 'pouchdb';
// import request from 'request';
import { Strategy as JwtStrategy } from 'passport-jwt';
import nano from 'nano';
import _ from 'underscore';
import jwt from 'jsonwebtoken';

import { secret, couch } from './config';

const opts = {
  secretOrKey: secret,
  issuer: 'adventurecycling.org',
  authScheme: 'JWT',
  algorithms: ['HS256']
}

export const moderator = new JwtStrategy(opts, (jwt_payload, done) => {
  if(_(jwt_payload.roles).contains('moderator') === true) {
    done(null, jwt_payload);
  } else {
    done('you are not a moderator', false);
  }
});

function create(email, roles) {
  return jwt.sign( { email, roles }, secret, {
    expiresIn: '5h',
    algorithm: 'HS256',
    issuer: 'adventurecycling.org'
  } );
}

// const url = `${couch.protocol}://${couch.domain}:${couch.port}/_session`;
const url = 'http://localhost:5984/_session';
const db = nano(url);

export function authenticate(req, res) {
  const { email, password } = req.body;

  if(email === '' || password === '') {
    return res.status(400).json({
      'bad request': 'you must supply a valid email and password'
    });
  }

  db.auth(email, password, (err, body, headers) => {
    if(err) {
      return res.status(400).json({ err });
    } else {
      const token = create(email, body.roles);
      return res.status(200).json({
        ok: 'a token has been provided',
        auth_token: token
      });
    }
  });
}
