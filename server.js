const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware ---------------------------------------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`API Server now listening on port ${PORT}`)
});