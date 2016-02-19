import nodemailer from 'nodemailer';
import config from 'config';

const subject = 'Register your bicycle touring digital companion account';
const mailAccount = config.get( 'mail.account' );

const {domain, port} = config.get( 'server' );
const api = `http://${domain}:${port}`;

/** @todo The default transporter is unreliable */
const transporter = nodemailer.createTransport();

/** @todo Use handlebars or jade for email templating */
export function mail( registrant, token ) {
  const {first, last} = registrant.attributes;
  transporter.sendMail( {
    from: mailAccount,
    to: registrant.get( 'email' ),
    subject: subject,
    html: `
<html>
  <body>
    <h1>Hello ${first} ${last}!</h1>
    <p>Thank you for your interest in the bicycle touring digital companion.
    <a href="${api}/register/${token}">Click here</a> to confirm your
    account</p>
  </body>
</html>`
  } );
}
