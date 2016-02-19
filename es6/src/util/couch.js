
import PouchDB from 'pouchdb';
import { sync } from 'backbone-pouch';
import nano from 'nano';
import config from 'config';

const {protocol, domain, port, username, password} = config.get( 'couch' );

export const url = `${protocol}://${domain}:${port}`;

// Export a nano driver on the CouchDB database, useful for dealing with
// users and authentication.
export const nano_db = nano( url );

// Connect multiple Backbone classes (Models and Collections) to the database.
// `database` is the name appended to the CouchDB url.
export function connect( database, ...klasses ) {
  const my = sync( {
    db: new PouchDB( url + '/' + database, { auth: { username, password } } )
  } );

  for ( let klass of klasses ) {
    klass.prototype.sync = my;
  }
}
