import mongoose, {Schema} from 'mongoose';
import express from 'express';

mongoose.connect('mongodb://localhost:27017/db');

const serviceSchema = new Schema({
  name: String,
  lat: Number,
  lon: Number,
  type: String
});
const Service = mongoose.model('Service', serviceSchema);

const app = express();
app.set('json spaces', 2);

app.get('/', (req, res) => {
  res.send('Hello World!! :)');
});

app.get('/services', (req, res) => {
  Service.find({}, (err, results) => {
    if (err) {
      console.error('AN ERROR OCCURRED');
    }
    console.log('found items:\n', results);
    res.json(results);
  });
});

app.listen(80);
