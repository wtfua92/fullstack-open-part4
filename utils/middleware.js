const logger = require('./logger');

const requestLogger = (req, res, next) => {
    logger.info(`${req.method} | ${req.path} | ${JSON.stringify(req.body, null, 2)}`);
    next();
};

const tokenHandler = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7);
    }
    next();
};

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);
    if (error) {
        return res.status(400).json({error: error.message});
    }
    next(error);
};

const unknownEndpoint = (req, res) => {
    logger.error(`Unknown endpoint: ${req.path}`);
    res.status(404).send({ error: 'unknown endpoint' });
};


module.exports = {
    errorHandler,
    unknownEndpoint,
    requestLogger,
    tokenHandler
};