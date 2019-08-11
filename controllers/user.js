const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users.map(u => u.toJSON()));
    } catch (e) {
        next(e);
    }
});

userRouter.post('/', async (req, res, next) => {
    if (!req.body.password) {
        return res.status(400).json({error: 'Password is required'});
    }

    if (req.body.password && req.body.password.length < 3) {
        return res.status(400).json({error: 'Password is required to contain at least 3 symbols'});
    }

    const newUser = new User(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser.toJSON());
    } catch (e) {
        next(e);
    }
});

module.exports = userRouter;