const supertest = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const Blog = require('../models/blog');
const {initialBlogs} = require('../utils/test_helpers');

const api = supertest(app);

describe('Blogs API', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});

        for (const blogEntry of initialBlogs) {
            let entry = new Blog(blogEntry);
            await entry.save();
        }
    });

    test('GET should respond with 200 and json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('should return blogs on GET request', async () => {
        const response = (await api
            .get('/api/blogs')).body;
        expect(response.length).toBe(initialBlogs.length);
    });

    test('should assign id property instead of _id', async () => {
        const blogEntry = new Blog(initialBlogs[0]).toJSON();
        expect(blogEntry.id).toBeDefined();
    });

    test('should create a new entry on POST request', async () => {
        const newBlogEntry = initialBlogs[0];
        const response = await api
            .post('/api/blogs')
            .send(newBlogEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const allBlogs = (await api.get('/api/blogs')).body;

        expect(allBlogs.length).toBe(initialBlogs.length + 1);
        expect(response.body.title).toBe(newBlogEntry.title);
    });

    test('should default to 0 if likes number is not provided', async () => {
        const newBlogEntry = initialBlogs[0];
        delete newBlogEntry.likes;
        const response = await api
            .post('/api/blogs')
            .send(newBlogEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        expect(response.body.likes).toBe(0);
    });

    test('should respond with 400 if title or author not provided', async () => {
        const newBlogEntry = initialBlogs[0];
        const anotherNewBlogEntry = initialBlogs[0];
        delete newBlogEntry.title;
        delete anotherNewBlogEntry.author;

        await api
            .post('/api/blogs')
            .send(newBlogEntry)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        await api
            .post('/api/blogs')
            .send(anotherNewBlogEntry)
            .expect(400)
            .expect('Content-Type', /application\/json/);

    });


    afterAll(() => {
        mongoose.connection.close();
    });
});