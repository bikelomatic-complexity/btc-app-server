import { Collection } from 'backbone';
import _ from 'underscore';

import ValidationMixin from './validation-mixin';
import CouchModel from './couch-model';
import schema from '../../../schema/user.json';

// ## User
// We extend from `CouchModel` to ensure we don't mess with `_id` or `_rev`
// by default
export const User = CouchModel.extend( {

  // In the domain layer, we uniquely reference Users by their emails. When
  // models are serialized into Couch docs, the `_id` key will be set.
  idAttribute: 'email',

  // The keys `name` and `type` are reserved by CouchDB's _users database
  safeguard: [ 'name', 'type' ],

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
  },

  // When de-serializing CouchDB documents into Backbone models, ignore these
  // special properties from the user database. We don't need them for app
  // purposes, and we don't need them for mapping purposes.
  parse: function( response, options ) {
    return _.omit( response, [
      'derived_key', 'iterations', 'password_scheme', 'salt', 'name', 'type'
    ] );
  }
} );

// Apply the ValidationMixin on the User schema
_.extend( User.prototype, ValidationMixin( schema ) );

// ## User Collection
export const UserCollection = Collection.extend( {
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
