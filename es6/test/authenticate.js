/*global describe it before after*/
import request from 'supertest';
import sinon from 'sinon';
import { assert } from 'chai';

// Used to help test
import jwt from 'jsonwebtoken';
import config from 'config';
import _ from 'underscore';

const secret = config.get( 'token.secret' );

// Under test
import { app } from '../src/app';
import { createToken } from '../src/authenticate';

// Modules to mock
import { nano_db } from '../src/util/couch';

describe( '/authenticate', function() {
  before( function() {
    this.request = request( app );
  } );
  describe( 'POST', function() {
    describe( 'stubbing nano_db.auth(): non-moderator user', function() {
      before( function() {
        this.stub = sinon.stub( nano_db, 'auth' );
        this.stub.callsArgWith( 2, null, { roles: [] }, null );
      } );
      it( 'responds with status 200 with valid credentials', function( done ) {
        this.request.post( '/authenticate' )
          .send( { email: 'foo@example.com', password: 'foo' } )
          .expect( 200, done );
      } );
      it( 'responds with `ok` and `auth_token` keys in `res`', function( done ) {
        this.request.post( '/authenticate' )
          .send( { email: 'foo@example.com', password: 'foo' } )
          .expect( function( res ) {
            if ( !res.body.ok ) {
              return 'response was 200, but `ok` message not set';
            } else if ( !res.body.auth_token ) {
              return 'response was 200, but no `auth_token` provided';
            }
          } )
          .end( done );
      } );
      it( 'responds with a valid jwt', function( done ) {
        this.request.post( '/authenticate' )
          .send( { email: 'foo@example.com', password: 'foo' } )
          .expect( function( res ) {
            try {
              if ( !res.body.ok ) {
                return 'response was 200, but `ok` message not set';
              } else if ( !res.body.auth_token ) {
                return 'response was 200, but no `auth_token` provided';
              }
              const decoded = jwt.verify( res.body.auth_token, secret );
              if ( !_.isArray( decoded.roles ) ) {
                return 'in the payload, roles should be an array';
              }
            } catch ( err ) {
              return err;
            }
          } )
          .end( done );
      } );
      it( 'responds with no roles', function( done ) {
        this.request.post( '/authenticate' )
          .send( { email: 'foo@example.com', password: 'foo' } )
          .expect( function( res ) {
            if ( !res.body.ok ) {
              return 'response was 200, but `ok` message not set';
            } else if ( !res.body.auth_token ) {
              return 'response was 200, but no `auth_token` provided';
            }
            try {
              const decoded = jwt.verify( res.body.auth_token, secret );
              if ( !decoded.roles.length === 0 ) {
                return 'a non moderator user should have no roles';
              }
            } catch ( err ) {
              return err;
            }
          } )
          .end( done );
      } );
      after( function() {
        this.stub.restore();
      } );
    } );
    describe( 'stubbing nano_db.auth(): non-user', function() {
      before( function() {
        this.stub = sinon.stub( nano_db, 'auth' );
        this.stub.callsArgWith( 2, 'error', null, null );
      } );
      it( 'responds with status 400 with invalid credentials', function( done ) {
        this.request.post( '/authenticate' )
          .send( { email: 'foo@example.com', password: 'bar' } )
          .expect( 400, done );
      } );
      after( function() {
        this.stub.restore();
      } );
    } );
    describe( 'JSON body', function() {
      it( 'responds with 400 when neither either email or password are specified', function( done ) {
        this.request.post( '/authenticate' )
          .expect( 400, done );
      } );
      it( 'responds with 400 when email left blank', function( done ) {
        this.request.post( '/authenticate' )
          .send( { email: '' } )
          .expect( 400, done );
      } );
      it( 'responds with 400 when password left blank', function( done ) {
        this.request.post( '/authenticate' )
          .send( { password: '' } )
          .expect( 400, done );
      } );
    } );
  } );
} );

describe( 'createToken()', function() {
  it( 'produces a valid jwt with no roles', function( done ) {
    const token = createToken( 'foo@example.com', [] );
    jwt.verify( token, secret, function( err, decoded ) {
      if ( err ) {
        done( err );
      } else {
        assert.deepPropertyVal( decoded, 'email', 'foo@example.com' );
        assert.deepProperty( decoded, 'roles' );
        assert.isArray( decoded.roles );
        assert.lengthOf( decoded.roles, 0 );
        done();
      }
    } );
  } );
  it( 'produces a valid jwt with a moderator role', function( done ) {
    const token = createToken( 'foo@example.com', [ 'moderator' ] );
    jwt.verify( token, secret, function( err, decoded ) {
      if ( err ) {
        done( err );
      } else {
        assert.deepPropertyVal( decoded, 'email', 'foo@example.com' );
        assert.deepProperty( decoded, 'roles' );
        assert.isArray( decoded.roles );
        assert.include( decoded.roles, 'moderator' );
        done();
      }
    } );
  } );
} );
