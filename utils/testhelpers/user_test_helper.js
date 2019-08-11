const User = require('../../models/user');
const logger = require('../logger');

const users = [
    {
        username: 'user1',
        name: 'User 1',
        password: 'user1password'
    },
    {
        username: 'user2',
        name: 'User 2',
        password: 'user2password'
    },
    {
        username: 'user3',
        name: 'User 3',
        password: 'user3password'
    },
];

const usersInDB = async () => {
    try {
        return (await User.find({})).map(b => b.toJSON());
    } catch (e) {
        logger.error(e.message);
    }
};

module.exports = {
    users,
    usersInDB
};