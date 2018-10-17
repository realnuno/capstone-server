'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });



// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names
// For example:
// const actorSurnames = { james: "Stewart", robert: "De Niro" };
// const { james: jimmy, robert: bobby } = actorSurnames;
// console.log(jimmy); // Stewart - the variable name is jimmy, not james
// console.log(bobby); // De Niro - the variable name is bobby, not robert
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: mylistRouter } = require("./mylist/mylist-router");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

const app = express();

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


passport.use(localStrategy);
passport.use(jwtStrategy);



app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/mylist/', mylistRouter);







//============= external API ======================================


const foursquare = require('node-foursquare-venues')(
    'OYGYB2BAY34FJBJQFNDJXFJC3YYRSZJCS5HKOQZAUT1ZFKU3',
    'QC3ZYQ2HCMCQOBLJV0RCL0B5ST0KBNIXHAJQ54ADI53XCDXA',
    '20180606')


app.get('/api/search', jwtAuth, (req, res) => {

    const input = req.query.q;

    foursquare.venues.explore({
        near: input,
        limit: 10
    }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
//            console.log(data);
            res.json(data)
        }
    });
});

app.get('/api/searchmore', jwtAuth, (req, res) => {


    const input = req.query.venueId;
//console.log(input);
    foursquare.venues.venue(
        input,
        {
        limit: 2
        }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
            res.json(data)
        }
    });
});

app.get('/api/searchphotos', jwtAuth, (req, res) => {

    const input = req.query.venueId;

    foursquare.venues.photos(
        input,
        {
        limit: 20
        }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
            res.json(data)
        }
    });
});







// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});



// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
