import Ajv from 'ajv';
import { omit } from 'underscore';

// # Validation Mixin Factory
// A function to generate a mixin that may be applied to a Backbone Model.
// To generate the mixin, you must supply a conformant JSON schema as JSON.
export default function( schema ) {

  // Instantiate a new schema compiler per mixin. It will be closed over by
  // the validate function in the mixin.
  const ajv = Ajv();

  return {
    validate: function( attributes, options ) {

      // Don't validate safeguarded keys, if any!
      let attrs;
      if ( this.safeguard ) {
        attrs = omit( attributes, this.safeguard );
      } else {
        attrs = attributes;
      }

      // Investigate filtering safeguarded keys.
      const valid = ajv.validate( schema, attrs );
      if ( !valid ) {
        return ajv.errors;
      }
    }
  };
}
