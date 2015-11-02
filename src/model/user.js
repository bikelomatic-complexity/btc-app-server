import { Model, Collection } from 'backbone';
import { connect } from '../db/couch';

export const User = Model.extend( {
  url: function() {
    return '/users/' + this.get( 'email' );
  },

  idAttribute: 'email',

  tokenize: function() {
    return this.pick( [ 'email', 'moderator' ] );
  }
} );
export const UserCollection = Collection.extend( {
  model: User,
  url: '/users'
} );

const couch = connect( 'users' );
couch.install( err => {
  User.prototype.sync = couch.sync;
  UserCollection.prototype.sync = couch.sync;
} );
