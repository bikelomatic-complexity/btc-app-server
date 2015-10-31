import {memoize} from 'underscore';
import backbone from 'backbone';
import connector from 'backbone-couch';
import nano from 'nano';

/**
 * CouchDB connection for the whole app.
 * @todo secure db and use environment variables
 */
export const connection = nano('http://localhost:5984');

export const connect = memoize(function(name) {
  return connector({
    host: '127.0.0.1',
    port: '5984',
    name: name
  });
});
