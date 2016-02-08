
import vendor from 'passport';
import _ from 'underscore';

/*
 * Let's not clog our code with `{ session: false }` since we're using a
 * stateless moderator API.
 */
vendor.authenticate = _( vendor.authenticate ).partial( _, { session: false } );

/*
 * Modified passport object
 */
export default vendor;
