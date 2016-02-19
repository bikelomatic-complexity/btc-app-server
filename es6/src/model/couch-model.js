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

import { Model } from 'backbone';
import { omit, union, keys, intersection, isArray } from 'underscore';

// Special keys that are reserved by serialized CouchDB documents
const baseSafeguard = [ '_id', '_rev' ];

// ## Couch Model
// This base class ensures the client will not unknowingly modify the special
// keys of a CouchDB document.
export default Model.extend( {

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
      // Record keys we are about to omit, for logging
      const omitted = intersection( keys( attrs ), this.safeguard );

      // Actually omit safeguarded keys
      attrs = omit( attrs, this.safeguard );

      for ( let attr of omitted ) {
        console.error( `Attr ${attr} safeguarded from improper modification` );
      }
    }

    return Model.prototype.set.call( this, attrs, options );
  }
} );
