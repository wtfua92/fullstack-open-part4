const Blog = require('../models/blog');
const initialBlogs = require('./list_helpers').blogsList;
const logger = require('./logger');

const nonExistingId = async () => {
    try {
        const blogEntry = new Blog(initialBlogs[0]);
        await blogEntry.save();
        await blogEntry.remove();

        return blogEntry._id.toString();
    } catch(e) {
        logger.error(e.message);
    }
};

const blogEntriesInDB = async () => {
    try {
        return (await Blog.find({})).map(b => b.toJSON());
    } catch (e) {
        logger.error(e.message);
    }
};

module.exports = {
    initialBlogs,
    nonExistingId,
    blogEntriesInDB
};