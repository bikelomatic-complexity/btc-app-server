import nodemailer from 'nodemailer';
import {mailAccount, api} from '../config';

const subject = 'Register your bicycle touring digital companion account';

/** @todo The default transporter is unreliable */
const transporter = nodemailer.createTransport();

export function mail(registrant, token) {
  const {first, last} = registrant.attributes;
  transporter.sendMail({
    from: mailAccount,
    to: registrant.get('email'),
    subject: subject,
    html: `
<html>
  <body>
    <h1>Hello ${first} ${last}!</h1>
    <p>Thank you for your interest in the bicycle touring digital companion.
    <a href="${api}/register?token=${token}">Click here</a> to confirm your
    account</p>
  </body>
</html>`
  });
}
