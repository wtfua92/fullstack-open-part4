const express = require('express');
const blogRouter = express.Router();

const Blog = require('../models/blog');

blogRouter.get('/', async (request, response, next) => {
    try {
        response.json((await Blog.find({}).populate('user')).map(b => b.toJSON()));
    } catch (e) {
        next(e);
    }
});

blogRouter.get('/:id', async (request, response, next) => {
    try {
        const individualBlog = await Blog.findById(request.params.id).populate('user');
        if (individualBlog) {
            return response.json(individualBlog.toJSON());
        }
        response.status(404).json({error: `Entry with ID ${request.params.id} wasn't found`});
    } catch (e) {
        next(e);
    }
});

blogRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body);
    try {
        const result = await blog.save();
        const resultWithUser = await Blog.populate(result, { path: 'user' });
        response.status(201).json(resultWithUser.toJSON());
    } catch (e) {
        next(e);
    }
});

blogRouter.put('/:id', async (request, response, next) => {
    try {
        const updatedItem = (await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true }));
        if (updatedItem) {
            return response.json(updatedItem.toJSON());
        }
        response.status(404).json({error: `Entry with ID ${request.params.id} wasn't found`});
    } catch (e) {
        next(e);
    }
});

blogRouter.delete('/:id', async (request, response, next) => {
    try {
        const result = await Blog.findByIdAndRemove(request.params.id);
        if (result) {
            return response.status(204).end();
        }
        response.status(404).json({error: `Entry with ID ${request.params.id} wasn't found`});
    } catch (e) {
        next(e);
    }
});


module.exports = blogRouter;