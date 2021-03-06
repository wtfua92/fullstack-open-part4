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
        if (!user) {
            return response.status(404).json({error: 'User is not found. Please try to login again'});
        }
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
    const userToken = request.token;
    if (!userToken) {
        return response.status(401).json({error: 'Only logged in users can delete blogs'});
    }

    try {
        const decodedToken = jwt.verify(userToken, process.env.SECRET);
        if (!decodedToken.id) {
            return response.status(401).json({error: 'Please log in'});
        }

        const result = await Blog.findById(request.params.id);

        if (!result) {
            return response.status(404).json({error: 'This blog entry was not found'});
        }

        const user = await User.findById(decodedToken.id);

        if (!user || user._id.toString() !== result.user.toString()) {
            return response.status(401).json({error: 'You did not create this blog'});
        }

        await Blog.deleteOne({ _id: result._id });
        user.blogs = user.blogs.filter(b => b.toString() !== result._id.toString());
        await user.save();
        return response.status(204).end();
    } catch (e) {
        next(e);
    }
});


module.exports = blogRouter;