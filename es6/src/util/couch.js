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
