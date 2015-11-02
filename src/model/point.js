import { Model, Collection } from 'backbone';
import { contains, has } from 'underscore';
import jsen from 'jsen';
import { connect } from '../db/couch';

const POINT_TYPES = [
  'bar',
  'bed and breakfast',
  'bike shop',
  'campground',
  'convenience store',
  'cyclists only camping',
  'cyclists only lodging',
  'grocery',
  'hostel',
  'hotel',
  'library',
  'rest area',
  'restroom',
  'restaurant',
  'state park',
  'museum',
  'information',
  'airport',
  'scenic area',
  'hot spring',
  'poi',
  'outdoor store',
  'public market',
  'cabin'
];

export const Point = Model.extend( {
  url: function() {
    return '/points/' + this.id;
  },

  validate: function( attributes, options ) {
    if(!Point.validator(attributes)) {
      return Point.validator.errors;
    }
  }
}, {
  TYPES: POINT_TYPES,

  validator: jsen({
    type: 'object',
    required: [ 'name', 'type', 'lat', 'lng' ],
    properties: {
      name: {
        type: 'string',
        requiredMessage: 'Name is required'
      },
      type: {
        type: 'string',
        enum: POINT_TYPES,
        invalidMessage: `Type must be one of [${POINT_TYPES.toString()}]`
      },
      lat: {
        type: 'number',
      },
      lng: {
        type: 'number'
      }
    },
    additionalProperties: false
  }, { greedy: true })
} );

export const PointCollection = Collection.extend( {
  model: Point,
  url: '/points'
} );

const couch = connect( 'points' );
couch.install( err => {
  Point.prototype.sync = couch.sync;
  PointCollection.prototype.sync = couch.sync;
} );
