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

// import { Model, Collection } from 'backbone';
// import jsen from 'jsen';
// import { connect } from '../db/couch';
//
// const POINT_TYPES = [
//   'bar',
//   'bed and breakfast',
//   'bike shop',
//   'campground',
//   'convenience store',
//   'cyclists only camping',
//   'cyclists only lodging',
//   'grocery',
//   'hostel',
//   'hotel',
//   'library',
//   'rest area',
//   'restroom',
//   'restaurant',
//   'state park',
//   'museum',
//   'information',
//   'airport',
//   'scenic area',
//   'hot spring',
//   'poi',
//   'outdoor store',
//   'public market',
//   'cabin'
// ];
//
// export const Point = Model.extend( {
//   url: function() {
//     return '/points/' + this.id;
//   },
//
//   validate: function( attributes, options ) {
//     if ( !Point.validator( attributes ) ) {
//       return Point.validator.errors;
//     }
//   }
// }, {
//   TYPES: POINT_TYPES,
//
//   validator: jsen( {
//     type: 'object',
//     required: [ 'name', 'type', 'lat', 'lng' ],
//     properties: {
//       name: {
//         type: 'string',
//         requiredMessage: 'Name is required'
//       },
//       type: {
//         type: 'string',
//         enum: POINT_TYPES,
//         invalidMessage: `Type must be one of [${POINT_TYPES.toString()}]`
//       },
//       lat: {
//         type: 'number'
//       },
//       lng: {
//         type: 'number'
//       }
//     },
//     additionalProperties: false
//   }, { greedy: true } )
// } );
//
// export const PointCollection = Collection.extend( {
//   model: Point,
//   url: '/points'
// } );
//
// const couch = connect( 'points' );
// couch.install( err => {
//   Point.prototype.sync = couch.sync;
//   PointCollection.prototype.sync = couch.sync;
// } );
