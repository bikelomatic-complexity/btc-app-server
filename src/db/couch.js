import {memoize} from 'underscore';
import backbone from 'backbone';
import connector from 'backbone-couch';

/**
 * Returns a new CouchDB connection for each database. Connections are
 * cached, so there is only ever one connection per databse.
 */
export const connect = memoize(function(name) {
  return connector({
    host: '127.0.0.1',
    port: '5984',
    name: name
  });
});
