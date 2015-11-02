import { Model, Collection } from 'backbone';
import { contains, has } from 'underscore';
import { connect } from '../db/couch';

export const TYPES = [
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
  'state pack',
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
    if ( !has( attributes, 'name' ) ) {
      return 'Name required';
    } else if ( !has( attributes, 'type' ) ) {
      return 'Type required';
    } else if ( !contains( TYPES, attributes.type ) ) {
      return 'Type must be supported by btdc';
    } else if ( !has( attributes, 'lat' ) ) {
      return 'Lat required';
    } else if ( !isFinite( attributes.lat ) ) {
      return 'Lat must be a finite number';
    } else if ( !has( attributes, 'lng' ) ) {
      return 'Lng required';
    } else if ( !isFinite( attributes.lng ) ) {
      return 'Lng must be a finite number';
    }
  }
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
