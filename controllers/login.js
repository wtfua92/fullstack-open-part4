const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const check = await bcrypt.compare(password, user.password);
        console.log(check);
        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(password, user.password);

        if (!(user && passwordCorrect)) {
            return res.status(401).json({
                error: 'invalid username or password'
            });
        }

        const tokenData = {
            username,
            id: user._id
        };
        const token = jwt.sign(tokenData, process.env.SECRET);

        res.json({username, name: user.name, token});
    } catch (e) {
        next(e);
    }
});

module.exports = loginRouter;