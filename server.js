const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const { Client } = require('pg');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send('it is working!') });
app.post('/signin', signin.handleSignin(client, bcrypt));
app.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json('Bad Request: Missing required fields');
  }
  register.handleRegister(req, res, client, bcrypt);
});

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, client) });
app.put('/image', (req, res) => { image.handleImage(req, res, client) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

