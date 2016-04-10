# App server for the Bicycle Touring Companion
[![Build Status](https://travis-ci.org/bikelomatic-complexity/btc-app-server.svg?branch=master)](https://travis-ci.org/bikelomatic-complexity/btc-app-server)
[![Coverage Status](https://coveralls.io/repos/github/bikelomatic-complexity/btc-app-server/badge.svg?branch=coveralls)](https://coveralls.io/github/bikelomatic-complexity/btc-app-server?branch=master)
[![Dependency Status](http://david-dm.org/bikelomatic-complexity/btc-app-server.svg)](http://david-dm.org/bikelomatic-complexity/btc-app-server)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

# Testing Locally
 - Install CouchDB
 - Run CouchDB
  - it should give you an option to automatically start on windows
  - on linux, depending on your install, this may be the following command
  `sudo -u couchdb /usr/bin/couchdb`
  - this may generate errors, but couchdb should still be running
 - `npm install && npm start` to get a server loaded on localhost:8080
 - go to `localhost:5984/_utils/` where CouchDB should be running (if you 
 selected to launch it after install)
  - go to the bottom right where a small dialogue box mentions that everyone is 
  an admin. Make sure to change this before (click the "fix this" link) and 
  follow those steps.
 - Look at the apiary (`apiary.apib`) for more information.
  - You can use postman to make the requests at `localhost:8080`
