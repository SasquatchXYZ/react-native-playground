const express = require('express');
const app = express();
const PORT = process.env || 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

// Middleware ---------------------------------------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`API Server now listening on port ${PORT}`)
});