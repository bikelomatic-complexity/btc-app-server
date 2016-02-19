/*global process*/
import PouchDB from 'pouchdb';
import { sync } from 'backbone-pouch';
import nano from 'nano';
import config from 'config';

const {protocol, domain, port, username, password} = config.get( 'couch' );

export const root = `${protocol}://${domain}:${port}`;

// Export a nano driver on the CouchDB database, useful for dealing with
// users and authentication.
export const nano_db = nano( root );

// Connect multiple Backbone classes (Models and Collections) to the database.
// `database` is the name appended to the CouchDB url.
export function connect( database, ...klasses ) {
  let url;
  if ( process.env.NODE_ENV === 'test' ) {
    url = database;
  } else {
    url = root + '/' + database;
  }

  const pouch = new PouchDB( url, { auth: { username, password } } );

  for ( let klass of klasses ) {
    klass.prototype.sync = sync( { db: pouch } );
  }
}
