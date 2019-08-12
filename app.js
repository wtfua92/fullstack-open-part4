const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {MONGO_URI} = require('./utils/config');
const {errorHandler, unknownEndpoint, requestLogger, tokenHandler} = require('./utils/middleware');
const logger = require('./utils/logger');

const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');

const app = express();

mongoose.connect(MONGO_URI, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false })
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

app.use(tokenHandler);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;