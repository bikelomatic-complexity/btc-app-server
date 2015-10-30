import express from 'express';
import nano from 'nano';

import {create} from '../token/token';

const couch = nano('http://localhost:5984');
const users = couch.db.use('users');

export const router = express.Router();
router.post('/', (req, res) => {
  const {email, password} = req.body;
  users.view('auth', 'by_email', {keys: [email], limit: 1}, (err, body) => {
    if(err) throw err;

    const [user,] = body.rows;
    if(!user) {
      res.json({success: false, message: 'Authentication failed. Email not in system.'});
    } else {
      // check if password matches
      if(user.value !== password) {
        res.json({success: false, message: 'Authentication failed. Wrong password.'});
      } else {
        // if user is found and password is right, create a token
        console.log(create);
        create(user.id).then(token => {
          console.log('blah');
          res.json({success: true, message: 'Enjoy your token', token: token});
        }, err => {
          res.json({success: false, message: err});
        })
      }
    }
  });
});
