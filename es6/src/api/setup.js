import { Router } from 'express';
import uuid from 'node-uuid';

import { UserCollection } from '../model/user';
import { PointCollection } from '../model/point';

/**
 * The authentication router's root allows the client to obtain a JWT for
 * use with all subsequent api calls.
 * @todo authenticate with OAuth providers
 */
export const router = Router();

/**
 * Issuing a GET request to the setup route will insert default data into
 * the database for testing purposes.
 */
router.get( '/', ( req, res ) => {
  new UserCollection().fetch( {
    success: users => {
      new Promise( ( resolve, reject ) => {
        if ( users.length === 0 ) resolve( users );

        while ( users.size() > 0 ) {
          let user = users.pop();
          user.destroy( {
            wait: true,
            success: model => {
              if ( users.length === 0 ) resolve( users );
            }
          } );
        }
      } ).then( users => {
        users.create( {
          id: 'barry@example.com',
          name: 'Barry Allen',
          password: 'flash',
          moderator: true
        } );
        users.create( {
          id: 'ollie@example.com',
          name: 'Oliver Queen',
          password: 'arrow',
          moderator: false
        } );
        users.create( {
          id: 'kat@example.com',
          name: 'Selina Kyle',
          password: 'catwoman',
          moderator: false
        } );
      } );
    },
    error: err => {
    }
  } );

  new PointCollection().fetch( {
    success: points => {
      new Promise( ( resolve, reject ) => {
        if ( points.length === 0 ) {
          resolve( points );
        }
        while ( points.size() > 0 ) {
          let point = points.pop();
          point.destroy( {
            wait: true,
            success: model => {
              if ( points.length === 0 ) resolve( points );
            }
          } );
        }
      } ).then( points => {
        points.create( {
          id: uuid.v4(),
          name: 'Adventure Cycling Headquarters',
          type: 'poi',
          address: '150 E Pine Street, Missoula, Montana 59802',
          lat: 46.873107,
          lng: -113.992082
        } );
        points.create( {
          id: uuid.v4(),
          name: 'Missoula KOA',
          type: 'campground',
          address: '3450 Tina Avenue, Missoula, Montana 59808',
          phone: 18005625366,
          lat: 46.896705,
          lng: -114.042341
        } );
        points.create( {
          id: uuid.v4(),
          name: 'The Bike Doctor',
          type: 'bike shop',
          address: '1101 Toole Avenue, Missoula, Montana 59802',
          phone: 14067215357,
          lat: 46.877831,
          lng: -114.006738
        } );
      } );
    },
    error: err => {
    }
  } );

  res.status( 200 ).end();
} );
