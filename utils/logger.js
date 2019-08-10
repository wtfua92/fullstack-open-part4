const env = process.env.NODE_ENV;

const info = (...params) => {
    if (env !== 'test') {
        console.log(...params);
    }
};

const error = (...params) => {
    console.error(...params);
};

module.exports = {
    info,
    error
};