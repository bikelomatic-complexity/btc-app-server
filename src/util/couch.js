/* btc-app-server -- Server for the Bicycle Touring Companion
 * Copyright © 2016 Adventure Cycling Association
 *
 * This file is part of btc-app-server.
 *
 * btc-app-server is free software: you can redistribute it and/or modify
 * it under the terms of the Affero GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * btc-app-server is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Affero GNU General Public License for more details.
 *
 * You should have received a copy of the Affero GNU General Public License
 * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 */

/*global process*/

// ## Couch Utilities
// This file provides utilities for working with CouchDB and PouchDB. The
// goal is to keep model code unaware of connection details. We are not able
// to separate PouchDB Sync options from the model code, however.

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
//
//  * In production, `database` is appended to CouchDB's root url
//  * In test, `database` is used as the name of a local database
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
