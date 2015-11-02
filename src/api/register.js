import express from 'express';

import { Registrant } from '../model/registrant';
import { create } from '../token/token';
import { ResponseBuilder } from '../api/response';
import { mail } from '../mailer';
import { verify } from '../token/token';

/**
 * Routes to allow a new user to register with the system.
 */
export const router = express.Router();

/**
 * Initiate the registration process. If the user information is valid,
 * email a token to the user, and save a record in the 'registrants' db.
 * The user will visit /api/register/confirm by clicking our link.
 *
 * @example
 * POST /api/register
 * {
 *   "email": "barry@example.com",
 *   "password": "flash",
 *   "first": "Barry",
 *   "last": "Allen",
 *   "username": ""
 * }
 */
router.post( '/', ( req, res ) => {
  const builder = new ResponseBuilder().method( 'post' );

  const registrant = new Registrant( req.body );

  const errors = registrant.validate();
  if ( errors ) {
    builder.status( false ).set( 'errors', errors ).send( res );
  }

  // Mail the token after the db insert succeeds
  const token = create( registrant );
  registrant.save( { 'token': token }, {
    success: ( registrant, response, options ) => {
      res.status( 200 ).end();
      mail( registrant, token );
    },
    error: err => {
      builder.status( false ).message( err ).send( res );
    }
  } );
} );

router.use( verify );
router.get( '/', ( req, res ) => {
  const builder = new ResponseBuilder().method( 'get' );

  const token = req.query.token;

  new Registrant( { 'token': token } ).fetch( {
    success: ( registrant, response, options ) => {
      registrant.confirm().then( ( ) => {
        builder.status( true ).message( 'you have registered' ).send( res );
      } ).catch( err => {
        builder.status( false ).message( err ).send( res );
      } );
    },
    error: err => {
      builder.status( false ).message( 'you have not registered yet' ).send( res );
    }
  } );
} );
