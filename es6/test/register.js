/*global describe it before after*/
import sinon from 'sinon';
import request from 'supertest';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';

chai.use( promised );

import PouchDB from 'pouchdb';
import { omit, extend } from 'underscore';

import * as mailer from '../src/util/mailer';
import { app } from '../src/app';

const bob = {
  email: 'bob@example.com',
  username: 'bob',
  first: 'Robert',
  last: 'Example',
  password: '123456789'
};

let _users = new PouchDB( '_users' );

describe( 'Routes', function() {
  before( function() {
    this.request = request( app );
  } );
  after( function( done ) {
    _users.destroy().then( res => done() ).catch( err => done( err ) );
  } );
  describe( '/register', function() {
    describe( 'Initiate Account Creation [POST]', function() {
      before( function() {
        this.stub = sinon.stub( mailer, 'mail' );
      } );
      after( function() {
        this.stub.restore();
      } );
      it( '+ Response 200', function( done ) {
        this.request.post( '/register' )
          .send( bob )
          .expect( 200, done );
      } );
      it( ' > `verification` and `verified` committed', function() {
        const doc = _users.get( 'org.couchdb.user:bob@example.com' );
        return Promise.all( [
          expect( doc ).to.eventually.have.property( 'verification' ),
          expect( doc ).to.eventually.have.property( 'verified', false )
        ] );
      } );
      it( ' > called the mailer function', function() {
        sinon.assert.called( this.stub );
      } );
      for ( let attr in bob ) {
        it( `+ Response 400 (omit ${attr})`, function( done ) {
          this.request.post( '/register' )
            .send( omit( bob, attr ) )
            .expect( 400, done );
        } );
      }
      for ( let password of [ '1234567', '12345678', '123456789' ] ) {
        const len = password.length;
        const code = len < 8 ? 400 : 200;
        it( `+ Response ${code} (password.length = ${len})`, function( done ) {
          this.request.post( '/register' )
            .send( extend( {}, bob, {
              password,
              email: `password.length.${len}@example.com`
            } ) )
            .expect( code, done );
        } );
      }
      it( '+ Response 400 (bad email format)', function( done ) {
        this.request.post( '/register' )
          .send( extend( {}, bob, { email: 'not.an.email' } ) )
          .expect( 400, done );
      } );
      it( '+ Response 200 (try to gain admin role)', function( done ) {
        this.request.post( '/register' )
          .send( extend( {}, bob, {
            roles: [ 'admin' ],
            email: 'nonadmin@example.com'
          } ) )
          .expect( 200, done );
      } );
      it( ' > No extra roles committed to CouchDB', function() {
        const doc = _users.get( 'org.couchdb.user:nonadmin@example.com' );
        return expect( doc ).to.eventually.have.property( 'roles' )
          .that.is.an( 'array' )
          .with.lengthOf( 0 );
      } );
    } );
  } );

  describe( '/register/:token', function() {
    describe( 'Verify Email [GET]', function() {
      let verification;

      it( ' > Extract token for test user', function( done ) {
        _users.get( 'org.couchdb.user:bob@example.com' )
          .then( doc => {
            verification = doc.verification;
            done();
          } )
          .catch( err => done( err ) );
      } );
      it( '+ Response 200', function( done ) {
        this.request.get( '/register/' + verification )
          .expect( 200, done );
      } );
      it( ' > `verififed` set to true', function() {
        const doc = _users.get( 'org.couchdb.user:bob@example.com' );
        expect( doc ).to.eventually.have.property( 'verified', true );
      } );
      it( '+ Response 400 (random token)', function( done ) {
        this.request.get( '/register/' + 'random' )
          .expect( 400, done );
      } );
    } );
  } );
} );
