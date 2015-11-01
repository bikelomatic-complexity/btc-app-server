import {Model, Collection} from 'backbone';
import {connect} from '../db/couch';

export const Point = Model.extend({
  url: function() { return '/points/' + this.get('name'); },
  idAttribute: 'name'
});
export const PointCollection = Collection.extend({
  model: Point,
  url: '/points'
})

const couch = connect('points');
couch.install(err => {
  Point.prototype.sync = couch.sync;
  PointCollection.prototype.sync = couch.sync;
});
