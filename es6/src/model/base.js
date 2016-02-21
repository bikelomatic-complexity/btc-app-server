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

import { Model, Collection } from 'backbone';
import { omit, union, isArray, intersection, keys, extend } from 'underscore';

// Special keys that are reserved by serialized CouchDB documents
const baseSafeguard = [ '_id', '_rev' ];

// ## Couch Model
// This base class ensures the client will not unknowingly modify the special
// keys of a CouchDB document.
export const CouchModel = Model.extend( {

  // By default, `CouchModel` safeguards `_id` and `_rev`. You can extend
  // this list of safeguarded keys by passing an array in `options.special`.
  initialize: function( attributes, options ) {
    Model.prototype.initialize.apply( this, arguments );

    if ( this.safeguard && isArray( this.safeguard ) ) {
      this.safeguard = union( baseSafeguard, this.safeguard );
    } else {
      this.safeguard = baseSafeguard;
    }
  },

  // When fetching a single document, allow overriding safeguarded Couch keys
  fetch: function( options ) {
    return Model.prototype.fetch.call( this, extend( {}, options, {
      force: true
    } ) );
  },

  // Override Backbone's set function to ignore all the special keys, *unless
  // our custom force option is set to true*.
  set: function( key, val, options ) {

    // We reuse Backbone's argument normalization code
    if ( key == null ) return this;

    let attrs;
    if ( typeof key === 'object' ) {
      attrs = key;
      options = val;
    } else {
      ( attrs = {} )[ key ] = val;
    }

    options || ( options = {} );

    if ( !options.force ) {
      // Uncomment to log keys that we omit from super.set()
      const omitted = intersection( keys( attrs ), this.safeguard );

      // Actually omit safeguarded keys
      attrs = omit( attrs, this.safeguard );

      if ( omitted.length > 0 ) {
        throw new Error( 'attempted override of safeguarded keys: ' +
          omitted.toString() );
      }
    }

    return Model.prototype.set.call( this, attrs, options );
  }
} );

// ## Couch Collection
// This base collection class helps the CouchModel to prevent the client
// from unknowingly modifying the special keys of a CouchDB document.
export const CouchCollection = Collection.extend( {

  // When fetching multiple documents, allow overriding safeguarded Couch keys
  fetch: function( options ) {
    return Collection.prototype.fetch.call( this, extend( {}, options, {
      force: true
    } ) );
  }
} );
