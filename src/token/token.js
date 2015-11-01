import jwt from 'jsonwebtoken';
import { secret } from '../config';

export function create( user ) {
  const token = jwt.sign( user.tokenize(), secret, {
    expiresIn: '15m',
    algorithm: 'HS256',
    issuer: 'localhost',
    subject: ( user.moderator ? 'moderator' : 'cyclist' ) + 'token'
  } );
  return token;
}

export function verify( req, res, next ) {
  const token = req.headers[ 'x-access-token' ] || req.query.token;
  if ( token ) {
    jwt.verify( token, secret, ( err, decoded ) => {
      if ( err ) {
        return res.json( { success: false, message: 'Failed to authenticate' } );
      } else {
        req.payload = decoded;
        next();
      }
    } );
  } else {
    return res.status( 403 ).send( {
      success: false,
      message: 'No token provided'
    } );
  }
}
