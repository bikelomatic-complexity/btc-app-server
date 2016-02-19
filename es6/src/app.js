/*global process*/
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import validator from 'express-validator';

import passport from './util/passport'; // passport with customizations

import cors from './cors';
import * as register from './register';
import * as authenticate from './authenticate';
import * as flag from './flag';

// Allows tokens that have a moderator role
passport.use( 'moderator', authenticate.strategy );

export const app = express();

app.set( 'json spaces', 2 );

if ( process.env.NODE_ENV === 'development' ) {
  app.use( morgan( 'dev' ) );
}
app.use( bodyParser.json() );
app.use( validator() );
app.use( passport.initialize() );
app.use( cors );

app.post( '/register', register.apply );
app.get( '/register/:verification', register.verify );

app.post( '/authenticate', authenticate.default );
app.get( '/flags', passport.authenticate( 'moderator' ), flag.list );

// Used by our Elastic Load Balacers
app.get( '/health', ( req, res ) => res.status( 200 ).send( 'ok' ) );
