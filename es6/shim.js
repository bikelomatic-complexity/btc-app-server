/*global process*/

import { walkSync } from 'fs-tools';
import { resolve, basename, relative } from 'path';
import { contains } from  'underscore';

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

if(process.env.NODE_ENV === 'development') {
  console.log('! mocha is now requiring all source .js files');
  console.log('! see shim.js for details.\n')
}

try {
  const es6src = resolve(__dirname, '..', 'es6', 'src');
  const es5src = resolve(__dirname, 'src');

  walkSync(es6src, '\.js$', function(path) {
    if(!contains(['index.js'], basename(path))) {
      const slug = relative(es6src, path);
      const file = resolve(es5src, slug);

      if(process.env.NODE_ENV === 'development') {
        console.log('!', file);
      }
      require(file);
    }
  });
} catch(err) {
  console.error(err);
}
