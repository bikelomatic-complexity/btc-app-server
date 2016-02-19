import { Model } from 'backbone';
import { omit, union, isArray } from 'underscore';

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
      // Uncomment to log keys that we omit from super.set()
      /* const omitted = intersection( keys( attrs ), this.safeguard ); */

      // Actually omit safeguarded keys
      attrs = omit( attrs, this.safeguard );
    }

    return Model.prototype.set.call( this, attrs, options );
  }
} );
