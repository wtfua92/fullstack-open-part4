const errorHandler = (error, req, res, next) => {
    if (error) {
        return res.status(400).json({error: error.message});
    }
    next(error);
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};


module.exports = {
    errorHandler,
    unknownEndpoint
};