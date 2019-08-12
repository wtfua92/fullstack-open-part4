const User = require('../../models/user');
const logger = require('../logger');

const users = [
    {
        username: 'user1',
        name: 'User 1',
        password: 'user1password',
        blogs: ['5d517132b3681801caf767df', '5d517132b3681801caf767e0']
    },
    {
        username: 'user2',
        name: 'User 2',
        password: 'user2password'
    },
    {
        username: 'user3',
        name: 'User 3',
        password: 'user3password',
        blogs: [
            '5d517132b3681801caf767e2',
            '5d517132b3681801caf767e1',
            '5d517132b3681801caf767e4',
            '5d517132b3681801caf767e3'
        ]
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