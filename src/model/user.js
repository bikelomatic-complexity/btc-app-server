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

import _ from 'underscore';

import ValidationMixin from './validation-mixin';
import { CouchModel, CouchCollection } from './base';
import schema from '../../schema/user.json';

// ## User
// We extend from `CouchModel` to ensure we don't mess with `_id` or `_rev`
// by default
export const User = CouchModel.extend( {

  // In the domain layer, we uniquely reference Users by their emails. When
  // models are serialized into Couch docs, the `_id` key will be set.
  idAttribute: 'email',

  // Reserved by documents in CouchDB's _users database
  safeguard: [
    'name',
    'type',
    'derived_key',
    'iterations',
    'password_scheme',
    'salt'
  ],

  // The majority of the time we are creating regular users, so we default
  // to an empty role set.
  defaults: {
    roles: [],
    verified: false
  },

  // Serialize the User object into a doc for CouchDB. CouchDB's special users
  // database has extra requirements.
  //  * `_id` must match `/org.couchdb.user:.*/`
  //  * `name` is equal to the portion after the colon
  //  * `type` must be `'user'`.
  toJSON: function( options ) {
    return Object.assign( {}, this.attributes, {
      _id: `org.couchdb.user:${this.attributes.email}`,
      name: this.attributes.email,
      type: 'user'
    } );
  }
} );

// Apply the ValidationMixin on the User schema
_.extend( User.prototype, ValidationMixin( schema ) );

// ## User Collection
export const UserCollection = CouchCollection.extend( {
  model: User,

  // Configure BackbonePouch to query all docs, but only return user documents.
  // This ignores design documents.
  //
  // *Eventually we need to setup views to increase performance!*
  pouch: {
    options: {
      allDocs: {
        include_docs: true,
        startkey: 'org.couchdb.user:',
        endkey: 'org.couchdb.user:\uffff'
      }
    }
  },

  // Both the query and allDocs methods return an augmented data array.
  // We are interested only in the `doc` property for each array element.
  parse: function( response, options ) {
    return _( response.rows ).pluck( 'doc' );
  }
} );
