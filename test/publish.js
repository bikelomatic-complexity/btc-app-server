/*global describe beforeEach it*/
import { mergeLatest } from '../lib/publish';

import { PointCollection } from 'btc-models';
import { expect } from 'chai';

describe( 'mergeLatest()', function() {
  beforeEach( function() {
    this.existing = new PointCollection( [ {
      _id: 'point/service/service-a/abcdef',
      location: [ 0, 0 ],
      type: 'other',
      description: 'old description'
    } ] );
    this.existing.at( 0 ).set( {
      created_at: '2016-05-05T19:44:42.000Z',
      updated_at: '2016-05-05T19:44:42.000Z'
    } );
  } );
  it( 'should handle additions', function() {
    const existing = new PointCollection();
    const incoming = new PointCollection( [ {
      _id: 'point/service/service-c/abcdef',
      location: [ 0, 0 ],
      type: 'other',
      created_at: '2016-05-05T19:44:47.000Z',
      updated_at: '2016-05-05T19:44:47.000Z'
    } ] );

    const merged = mergeLatest( existing.models, incoming.models );
    expect( merged ).to.have.lengthOf( 1 );
  } );
  it( 'should handle chosen updates', function() {
    const incoming = new PointCollection( [ {
      _id: 'point/service/service-a/abcdef',
      location: [ 0, 0 ],
      type: 'other',
      description: 'new description'
    } ] );
    incoming.at( 0 ).set( {
      created_at: '2016-05-05T19:44:47.000Z',
      updated_at: '2016-05-05T19:44:47.000Z'
    } );

    const merged = mergeLatest( this.existing.models, incoming.models );
    expect( merged ).to.have.lengthOf( 1 );
    expect( merged ).to.have.deep.property( '[0].attributes.description', 'new description' );
  } );
  it( 'should handle rejected updates', function() {
    const incoming = new PointCollection( [ {
      _id: 'point/service/service-a/abcdef',
      location: [ 0, 0 ],
      type: 'other',
      description: 'new description'
    } ] );
    incoming.at( 0 ).set( {
      created_at: '2016-05-05T19:44:40.000Z',
      updated_at: '2016-05-05T19:44:40.000Z'
    } );

    const merged = mergeLatest( this.existing.models, incoming.models );
    expect( merged ).to.have.lengthOf( 1 );
    expect( merged ).to.have.deep.property( '[0].attributes.description', 'old description' );
  } );
} );
