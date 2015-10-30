import nano from 'nano';

/**
 * CouchDB connection for the whole app.
 * @todo secure db and use environment variables
 */
export const connection = nano('http://localhost:5984');
