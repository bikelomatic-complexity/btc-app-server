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
