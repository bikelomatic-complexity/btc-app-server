import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import nano from 'nano';

import {verify} from './token/token';
import * as config from './config';

import {router as auth} from './routers/auth';

console.log(nano);

const couch = nano('http://localhost:5984');
const users = couch.db.use('users');

const app = express();
app.set('secret', config.secret);
app.set('json spaces', 2);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {
  extended: false
}));

app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('Hello! The API is at http://localhost:' + config.port + '/api');
});

app.get('/setup', (req, res) => {
  const nick = {
    name: 'Nick Cerminara',
    password: 'password',
    admin: true
  };

  db.save(nick, (err, cres) => {
    console.log(err);
    console.log(cres);

    res.json({success: true});
  });

  // nick.save(function(err) {
  //   if (err) throw err;
  //   console.log('user saved successfully');
  //   res.json({success: true});
  // })

});

const api = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

api.use('/authenticate', auth)

// api.post('/authenticate', (req, res) => {
//   const name = req.body.name;
//   users.view('users', 'all', {
//     keys: [name],
//     limit: 1
//   }, (err, body) => {
//     if (err) throw err;
//     const user = body.rows[0].value;
//     if(!user) {
//       res.json({success: false, message: 'Authentication failed. User not found.'});
//     } else if (user) {
//       //check if password matches
//       if(user.password != req.body.password) {
//         res.json({success: false, message: 'Authentication failed. Wrong password.'});
//       } else {
//         // if user is found and password is right, create a token
//         const token = jwt.sign(user, app.get('secret'), {
//           expiresInMinutes: 1440
//         });
//         res.json({
//           success: true,
//           message: 'Enjoy your token!',
//           token: token
//         });
//       }
//     }
//   });
// });

// TODO: route middleware to verify a token
api.use(verify);

// api.use((req, res, next) => {
//   const token = req.headers['x-access-token'];
//   if(token) {
//     jwt.verify(token, app.get('secret'), (err, decoded) => {
//       if(err) {
//         return res.json({success: false, message: 'Failed to authenticate token'});
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     return res.status(403).send({
//       success: false,
//       message: 'No token provided'
//     });
//   }
// })

// Route to show a randome message (GET http://localhost:8080/api/)
api.get('/', (req, res) => {
  res.json({message: 'Welcome to the coolest API on earth!'});
});
api.get('/users', (req, res) => {
  users.view('users', 'all', (err, body) => {
    console.log(body);
    res.json(body.rows.map(row => row.value));
  });
});

app.use('/api', api);

app.listen(config.port);
console.log('Serving at http://localhost:' + config.port);
