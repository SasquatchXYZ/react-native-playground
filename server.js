require('dotenv').config();

const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware ---------------------------------------------------------
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`API Server now listening on port ${PORT}`)
});