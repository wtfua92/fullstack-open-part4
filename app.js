const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {MONGO_URI} = require('./utils/config');
const {errorHandler, unknownEndpoint} = require('./utils/middleware');
const blogRouter = require('./controllers/blog');

const app = express();

mongoose.connect(MONGO_URI, { useCreateIndex: true, useNewUrlParser: true })
    .then(() => {
        console.log('DB connected');
    })
    .catch(() => {
        console.log('Error connecting to DB');
    });

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api/blogs', blogRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;