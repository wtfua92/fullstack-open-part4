const express = require('express');
const blogRouter = express.Router();

const Blog = require('../models/blog');

blogRouter.get('/', (request, response, next) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs.map((b) => b.toJSON()));
        })
        .catch((e) => next(e));
});

blogRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body);
    try {
        const result = (await blog.save()).toJSON();
        response.status(201).json(result);
    } catch (e) {
        next(e);
    }
});

module.exports = blogRouter;