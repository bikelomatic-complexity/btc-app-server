
import nano from 'nano';
import config from 'config';

const {protocol, domain, port} = config.get( 'couch' );

const url = `${protocol}://${domain}:${port}/`;

/*
 * Export a nano driver on the CouchDB database, useful for dealing with
 * users and authentication.
 */
export const nano_db = nano( url );
