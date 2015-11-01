import {Collection} from 'backbone';
import {ValidatedModel} from '../model/validated';
import {User} from '../model/user';
import {connect} from '../db/couch';

export const Registrant = ValidatedModel.extend({
  url: function() { return '/registrants/' + this.get('token'); },

  idAttribute: 'token',

  validation: {
    email: {
      required: true,
      pattern: 'email'
    },
    username: {
      required: true
    },
    first: {
      required: true
    },
    last: {
      required: true
    },
    password: {
      required: true // Need password requirements here later
    }
  },

  getFields: function() {
    return this.pick(['email', 'password', 'first', 'last', 'username']);
  },

  confirm: function() {
    var self = this;
    return new Promise((resolve, reject) => {
      console.log(this.getFields());
      new User().save(this.getFields(), {
        success: (user, response, options) => {
          console.log('here');
          self.destroy();
          resolve();
        },
        error: err => {
          console.log('there');
          reject(err);
        }
      });
    });
  },

  tokenize: function() {
    return this.pick('email');
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
