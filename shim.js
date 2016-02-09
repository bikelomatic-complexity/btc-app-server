/*global process __dirname require*/

var walkSync = require('fs-tools').walkSync,
    contains = require('underscore').contains,
    path = require('path');

var resolve = path.resolve,
    basename = path.basename,
    relative = path.relative;

/*
 * Istanbul only instruments source files that are required by mocha while
 * testing. This shim ensures all .js source files that exist in the es6 tree
 * are required by mocha in the es5 tree.
 *
 * NOTE: We can't just require all .js files in the es5 tree, because they
 * may become stale as the es6 tree changes.
 *
 * NOTE: We also can't require index.js, because that launches the server!
 */

if ( process.env.NODE_ENV === 'development' ) {
  console.log( '! mocha is now requiring all source .js files' );
  console.log( '! see shim.js for details.\n' );
}

try {
  var es6src = resolve( __dirname, '..', 'es6', 'src' );
  var es5src = resolve( __dirname, 'src' );

  walkSync( es6src, '\.js$', function( path ) {
    if ( !contains( [ 'index.js' ], basename( path ) ) ) {
      var slug = relative( es6src, path );
      var file = resolve( es5src, slug );

      if ( process.env.NODE_ENV === 'development' ) {
        console.log( '!', file );
      }
      require( file );
    }
  } );
} catch ( err ) {
  console.error( err );
}
