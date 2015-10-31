import {Router} from 'express';

import {User, UserCollection} from '../model/user'
import {connection} from '../db/couch';
import {ResponseBuilder} from '../api/response';

const points = connection.db.use('points');

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
router.get('/', (req, res) => {
  new UserCollection().fetch({
    success: users => {
      new Promise((resolve, reject) => {
        if(users.length === 0) resolve(users);

        let user;
        while(user = users.pop()) {
          user.destroy({
            wait: true,
            success: model => {
              if(users.length === 0) resolve(users);
            }
          });
        }
      }).then(users => {
        users.create({
          id: 'barry@example.com',
          name: 'Barry Allen',
          password: 'flash',
          moderator: true
        });
        users.create({
          id: 'ollie@example.com',
          name: 'Oliver Queen',
          password: 'arrow',
          moderator: false
        });
        users.create({
          id: 'kat@example.com',
          name: 'Selina Kyle',
          password: 'catwoman',
          moderator: false
        });
      });
    },
    error: err => {}
  });

  const point_docs = {docs: [ {
    name: 'Adventure Cycling Headquarters',
    type: 'Bicyle Travel Mecca',
    address: '150 E Pine Street, Missoula, Montana 59802',
    lat: 46.873107,
    lng: -113.992082
  }, {
    name: 'Missoula KOA',
    type: 'Campground',
    address: '3450 Tina Avenue, Missoula, Montana 59808',
    phone: 18005625366,
    lat: 46.896705,
    lng: -114.042341
  }, {
    name: 'The Bike Doctor',
    type: 'Bicycle Shop',
    address: '1101 Toole Avenue, Missoula, Montana 59802',
    phone: 14067215357,
    lat: 46.877831,
    lng: -114.006738
  } ] };

  points.bulk(point_docs, { 'all_or_nothing': true }, (err, body) => { });

  res.status(200).end();
});
