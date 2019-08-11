const supertest = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const Blog = require('../models/blog');
const {initialBlogs, nonExistingId, blogEntriesInDB} = require('../utils/testhelpers/test_helpers');

const api = supertest(app);

describe('Blogs API', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});

        await Promise.all(initialBlogs.map(b => {
            const entry = new Blog(b);
            return entry.save();
        }));
    });

    describe('GET', () => {
        test('GET should respond with 200, json content type and a list of blogs', async () => {
            const response = (await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)).body;
            expect(response.length).toBe(initialBlogs.length);
        });

        test('should return individual entry', async () => {
            const firstBlogItem = (await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)).body[0];

            const individualBlog = (await api
                .get(`/api/blogs/${firstBlogItem.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)).body;

            expect(individualBlog.id).toEqual(firstBlogItem.id);
            expect(individualBlog.title).toEqual(firstBlogItem.title);
        });

        test('should respond with 404 if id does not exist', async () => {
            const nonId = await nonExistingId();
            await api
                .get(`/api/blogs/${nonId}`)
                .expect(404)
                .expect('Content-Type', /application\/json/);
        });
    });

    describe('DELETE', () => {
        test('should respond with 404 if id does not exist', async () => {
            const nonId = await nonExistingId();
            await api
                .delete(`/api/blogs/${nonId}`)
                .expect(404)
                .expect('Content-Type', /application\/json/);
        });

        test('should delete a blog item successfully', async () => {
            const itemToDelete = (await blogEntriesInDB())[0];
            await api
                .delete(`/api/blogs/${itemToDelete.id}`)
                .expect(204);
        });
    });

    describe('PUT', () => {
        test('should respond with 404 if id does not exist', async () => {
            const nonId = await nonExistingId();
            await api
                .put(`/api/blogs/${nonId}`)
                .send({ likes: 404 })
                .expect(404)
                .expect('Content-Type', /application\/json/);
        });

        test('should update a blog item successfully', async () => {
            const itemToUpdate = (await blogEntriesInDB())[0];
            const response = await api
                .put(`/api/blogs/${itemToUpdate.id}`)
                .send({ likes: 200 })
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8');

            expect(response.body.id).toBe(itemToUpdate.id);
            expect(response.body.likes).toBe(200);
        });
    });

    describe('POST', () => {
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
    });

    afterAll(() => {
        mongoose.connection.close();
    });
});