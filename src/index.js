import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import {port, api as path} from './config';

import {router as api} from './api';

const app = express();
app.set('json spaces', 2);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`Hello! The API is at ${path}`);
});

app.use('/api', api);

app.listen(port);
console.log('Serving at http://localhost:' + port);
