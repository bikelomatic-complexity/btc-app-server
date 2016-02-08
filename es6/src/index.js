import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from './util/passport'; // passport with customizations
import config from 'config';

import * as authenticate from './authenticate';
import * as flag from './flag';

// Allows tokens that have a moderator role
passport.use( 'moderator', authenticate.strategy );

const app = express();

app.set( 'json spaces', 2 );

app.use( morgan( 'dev' ) );
app.use( bodyParser.json() );
app.use( passport.initialize() );

app.post( '/authenticate', authenticate.default );
app.get( '/flags', passport.authenticate( 'moderator' ), flag.list );

const {domain, port} = config.get( 'server' );
app.listen( port );
console.log( `Serving at http://${domain}:${port}` );
