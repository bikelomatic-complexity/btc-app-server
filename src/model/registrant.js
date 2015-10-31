import {Model, Collection} from 'backbone';
import {pick} from 'underscore';
import {connect} from '../db/couch';

export const Registrant = Model.extend({
  url: function() { return '/registrants/' + this.id; },
  tokenize: function() {
    return pick(this.attributes, ['email']);
  }
});
export const RegistrantCollection = Collection.extend({
  model: Registrant,
  url: '/registrant'
})

const couch = connect('registrants');
couch.install(err => {
  Registrant.prototype.sync = couch.sync;
  RegistrantCollection.prototype.sync = couch.sync;
});
