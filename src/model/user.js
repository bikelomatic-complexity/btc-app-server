import {Model, Collection} from 'backbone';
import {pick} from 'underscore';
import {connect} from '../db/couch';

export const User = Model.extend({
  url: function() { return '/users/' + this.id; },
  tokenize: function() {
    return pick(this.attributes, ['id', 'moderator']);
  }
});
export const UserCollection = Collection.extend({
  model: User,
  url: '/users'
})

const couch = connect('users_test');
couch.install(err => {
  User.prototype.sync = couch.sync;
  UserCollection.prototype.sync = couch.sync;
});
