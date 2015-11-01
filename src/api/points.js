import express from 'express';
import uuid from 'node-uuid';
import { extend } from 'underscore';

import { PointCollection } from '../model/point';
import { ResponseBuilder } from '../api/response';

/** Routes pertaining to the points list */
export const router = express.Router();

/**
 * @example
 * GET /api/points
 * [ {
 *   "name": "Adventure Cycling Headquarters",
 *   "type": "Bicycle Travel Mecca",
 *   "address": "150 E Pine Street, Missoula, Montana 59802",
 *   "lat": 46.873107,
 *   "lng": -113.992082
 * } ]
 */
router.get( '/', ( req, res ) => {
  const builder = new ResponseBuilder().method( 'get' );
  new PointCollection().fetch( {
    success: points => {
      builder.status( true ).json( points ).send( res );
    },
    error: err => {
      builder.status( false ).message( err ).send( res );
    }
  } );
} );

router.post( '/', ( req, res ) => {
  const builder = new ResponseBuilder().method( 'post' );

  const fields = extend( req.body, { id: uuid.v4() } );
  const point = new PointCollection().create( fields, {
    success: point => {
      builder.status( true ).json( point ).send( res );
    },
    error: err => {
      builder.status( false ).message( err ).send( res );
    }
  } );
  if ( point.validationError ) {
    builder.status( false ).message( point.validationError ).send( res );
  }
} );
