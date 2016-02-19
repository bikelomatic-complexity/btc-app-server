/*global describe it before after*/
import request from 'supertest';
import sinon from 'sinon';
import { assert } from 'chai';

// Under test
import { app } from '../src/app';

// Modules to mock
import { nano_db } from '../src/util/couch';

describe( 'Routes', function() {
  before( function() {
    this.request = request( app );
  } );
  describe( '/health', function() {
    describe( 'Check if the server is alive [GET]', function() {
      it( '+ Response 200', function( done ) {
        this.request.get( '/health' )
          .expect( 200, done );
      } );
    } );
  } );
} );

let token;
describe( 'Moderator user', function() {
  before( function() {
    this.request = request( app );
  } );
  describe( 'stubbing nano_db.auth(): moderator user', function() {
    before( function() {
      this.stub = sinon.stub( nano_db, 'auth' );
      this.stub.callsArgWith( 2, null, { roles: [ 'moderator' ] }, null );
    } );
    it( 'can log in as a moderator', function( done ) {
      this.request.post( '/authenticate' )
        .send( { email: 'moderator@example.com', password: 'moderator' } )
        .expect( function( res ) {
          token = res.body.auth_token;
        } )
        .end( done );
    } );
    it( '...and then access a moderator resource', function( done ) {
      this.request.get( '/flags' )
        .set( 'Authorization', `JWT ${token}` )
        .expect( function( res ) {
          assert.isArray( res.body );
        } )
        .end( done );
    } );
    after( function() {
      this.stub.restore();
    } );
  } );
} );
