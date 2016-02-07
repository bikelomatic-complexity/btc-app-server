/*global describe before it*/
import { expect } from 'chai';

import { Point } from '../../src/model/point';

describe( '/model/point', function() {
  describe( '~Point', function() {
    describe( '#validate', function() {
      before( function() {
        this.point = new Point( {
          name: 'Adventure Cycling Headquarters',
          type: 'poi',
          lat: 46.873107,
          lng: -113.992082
        } );
      } );
      it( 'should pass a point with all the required fields', function() {
        const point = new Point();
        point.set( {
          name: 'Adventure Cycling Headquarters',
          type: 'poi',
          lat: 46.873107,
          lng: -113.992082
        }, { validate: true } );

        expect( point.validationError ).to.be.null;
      } );
      it( 'should fail a point with a missing field', function() {
        const point = new Point();
        point.set( {
          name: 'Adventure Cycling Headquarters',
          type: 'poi',
          lat: 46.873107
        }, { validate: true } );

        expect( point.validationError ).to.exist;
      } );
      it( 'should require lat and lng to be numbers', function() {
        this.point.set( {
          lat: 'this is a string'
        }, { validate: true } );

        expect( this.point.validationError ).to.exist;

        this.point.set( {
          lng: 'this is a string'
        }, { validate: true } );

        expect( this.point.validationError ).to.exist;
      } );
    } );
  } );
} );
