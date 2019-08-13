const logger = require('./logger');

const requestLogger = (req, res, next) => {
    let message = `${req.method} | ${req.path}`;
    if (req.method === 'POST' || req.method === 'PUT') {
        message += ` | ${JSON.stringify(req.body, null, 2)}`;
    }
    logger.info(message);
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