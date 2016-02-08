import { app } from './app';
import config from 'config';

const {domain, port} = config.get( 'server' );
app.listen( port );
console.log( `Serving at http://${domain}:${port}` );
