import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';

import { port, api as path } from './config';

import { router as api } from './api';

import { authenticate, moderator } from './authenticate';

passport.use('moderator', moderator);

const app = express();
app.set( 'json spaces', 2 );

app.use( morgan( 'dev' ) );
app.use( bodyParser.json() );
app.use( passport.initialize() );

app.get( '/', ( req, res ) => {
  res.send( `Hello! The API is at ${path}` );
} );

app.use( '/api', api );

app.post( '/authenticate', authenticate );

app.get( '/test', passport.authenticate('moderator', { session: false }), (req, res) => {
  res.send('You are a moderator');
});

app.listen( port );
console.log( 'Serving at http://localhost:' + port );
