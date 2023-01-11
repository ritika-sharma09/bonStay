const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const route = require('./routes/routing')
const port = process.env.PORT || 3000;

let app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', route);


mongoose.connect('mongodb://localhost:27017/bonStay')
  .then(() => { console.log("DB connection successful!"); })
  .catch(console.log("err"));

app.listen(port, () => {
  console.log(`App running on port : ${port}`);
});





