const express = require('express');
const jwt = require('jsonwebtoken');
const blogRouter = express.Router();

const Blog = require('../models/blog');
const User = require('../models/user');

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
    const userToken = request.token;
    const blog = new Blog(request.body);
    try {
        const decodedToken = jwt.verify(userToken, process.env.SECRET);
        if (!userToken || !decodedToken.id) {
            return response.status(401).json({error: 'only authorized users allowed to create blogs, please login'});
        }
        const user = await User.findById(decodedToken.id);
        user.blogs = user.blogs.concat(blog._id);
        await user.save();

        blog.user = user._id;
        const result = await blog.save();

        const resultWithUser = await Blog.populate(result, { path: 'user' });
        return response.status(201).json(resultWithUser.toJSON());
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