import {Model, Collection} from 'backbone';
import connector from 'backbone-couch';
import {pick} from 'underscore';

const couch = connector({
  host: '127.0.0.1',
  port: '5984',
  name: 'users_test'
});

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

couch.install(err => {
  User.prototype.sync = couch.sync;
  UserCollection.prototype.sync = couch.sync;
});
