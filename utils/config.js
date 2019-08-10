require('dotenv').config();
let MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

if (process.env.NODE_ENV === 'test') {
    MONGO_URI = process.env.MONGO_URI_TEST;
}

module.exports = {
    MONGO_URI,
    PORT
};