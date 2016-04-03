/* btc-app-server -- Server for the Bicycle Touring Companion
 * Copyright © 2016 Adventure Cycling Association
 *
 * This file is part of btc-app-server.
 *
 * btc-app-server is free software: you can redistribute it and/or modify
 * it under the terms of the Affero GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * btc-app-server is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Affero GNU General Public License for more details.
 *
 * You should have received a copy of the Affero GNU General Public License
 * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 */

import nodemailer from 'nodemailer';
import config from 'config';
import fs from 'fs';
import _ from 'underscore';

const subject = 'Register your bicycle touring digital companion account';
const mailAccount = config.get( 'mail.account' );

const {domain, port} = config.get( 'server' );
const api = `http://${domain}:${port}`;

/** @todo The default transporter is unreliable */
const transporter = nodemailer.createTransport();

/** @todo Use handlebars or jade for email templating */
export function mail( registrant, token ) {
  const registrationTemplate = fs.readFileSync( './emailTemplates/registration.html', 'utf8' );
  const {first, last} = registrant.attributes;
  transporter.sendMail( {
    from: mailAccount,
    to: registrant.get( 'email' ),
    subject: subject,
    html: _.template( registrationTemplate )( { first, last, api, token } )
  } );
}
