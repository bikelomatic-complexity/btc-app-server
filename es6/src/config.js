/*global process*/
export const secret = process.env.SECRET;

export const port = process.env.PORT || 8080;
export const domain = '127.0.0.1';
export const api = `http://${domain}:${port}/api`;

export const couch_protocol = 'http';
export const couch_balancer = '';
export const couch_port = 5984;

export const couch = {
  protocol: 'http',
  port: 5984,
  domain: 'opsworks-database-1500749100.us-east-1.elb.amazonaws.com'
}

export const mailAccount = 'btdc@adventurecycling.org';
