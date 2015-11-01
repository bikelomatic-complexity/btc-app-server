import express from 'express';

import { User } from '../model/user';
import { create } from '../token/token';
import { ResponseBuilder } from '../api/response';

/** holds authentication routes */
export const router = express.Router();

/**
 * Authenticates user via their username and password and returns an api
 * token if successful.
 *
 * @example
 * POST /api/authenticate
 * {
 *   "email": "skroob@spaceballs.com",
 *   "password": "123456"
 * }
 * ---
 * {
 *   "token": "aaaaaaaaaa.bbbbbbbbbbb.cccccccccccc"
 * }
 */
router.post( '/', ( req, res ) => {
  const {email, password} = req.body;

  const builder = new ResponseBuilder().method( 'post' );
  const fail = builder.status( false ).message( 'Authentication failed: ' );

  new User( { 'email': email } ).fetch( {
    success: user => {
      // If user is found and password is right, create a token
      if ( user.matches( { 'password': password } ) ) {
        builder.status( true ).set( 'token', create( user ) ).send( res );
      } else {
        fail.message( 'wrong password' ).send( res );
      }
    },
    error: err => {
      fail.message( 'user not in system' ).send( res );
    }
  } );
} );
