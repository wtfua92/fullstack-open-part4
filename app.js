const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {MONGO_URI} = require('./utils/config');
const {errorHandler, unknownEndpoint, requestLogger} = require('./utils/middleware');
const blogRouter = require('./controllers/blog');
const logger = require('./utils/logger');

const app = express();

mongoose.connect(MONGO_URI, { useCreateIndex: true, useNewUrlParser: true })
    .then(() => {
        logger.info('DB connected');
    })
    .catch(() => {
        logger.error('Error connecting to DB');
    });

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(requestLogger);

app.use('/api/blogs', blogRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;