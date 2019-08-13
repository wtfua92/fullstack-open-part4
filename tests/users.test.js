const mongoose = require('mongoose');
const supertest = require('supertest');

const User = require('../models/user');
const Blog = require('../models/blog');
const app = require('../app');
const {users, usersInDB} = require('../utils/testhelpers/user_test_helper');
const {initialBlogs} = require('../utils/testhelpers/test_helpers');

const api = supertest(app);

describe('User Controller', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Blog.deleteMany({});

        const blogsToSave = initialBlogs.map((b) => {
            const entry = new Blog(b);
            return entry.save();
        });

        const savedBlogs = await Promise.all(blogsToSave);

        const usersToSave = users.map((u, i) => {
            const user = new User(u);
            user.blogs = user.blogs.concat(savedBlogs[i]._id);
            return user.save();
        });

        await Promise.all(usersToSave);
    });

    describe('GET', () => {
        test('should return users populated with blogs', async () => {
            const response = (await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)).body;

            expect(response.length).toBe(users.length);
            expect(response[0].password).toBeUndefined();
            expect(response[0].id).toBeDefined();
            expect(response[0].blogs[0].title).toBeDefined();
        });
    });

    describe('POST', () => {
        test('should return 400 if username is not unique', async (done) => {
            const usersAtStart = await usersInDB();

            await api
                .post('/api/users')
                .send(users[0])
                .expect(400)
                .expect('Content-Type', /application\/json/);

            const usersAtEnd = await usersInDB();

            expect(usersAtEnd.length).toBe(usersAtStart.length);
            done();
        });

        test('should return 400 and corresponding error if password is not provided', async (done) => {
            const usersAtStart = await usersInDB();

            const response = (await api
                .post('/api/users')
                .send({...users[0], password: ''})
                .expect(400)
                .expect('Content-Type', /application\/json/)).body;

            const usersAtEnd = await usersInDB();

            expect(usersAtEnd.length).toBe(usersAtStart.length);
            expect(response.error).toBe('Password is required');
            done();
        });

        test('should return 400 and corresponding error if password is shorter than 3 symbols', async (done) => {
            const usersAtStart = await usersInDB();
            const response = (await api
                .post('/api/users')
                .send({...users[0], password: '12'})
                .expect(400)
                .expect('Content-Type', /application\/json/)).body;

            const usersAtEnd = await usersInDB();

            expect(usersAtEnd.length).toBe(usersAtStart.length);
            expect(response.error).toBe('Password is required to contain at least 3 symbols');
            done();
        });

        test('should return 201 and user object after saving', async (done) => {
            const usersAtStart = await usersInDB();
            const userToBeSaved = users[0];
            userToBeSaved.username = 'user4';

            const response = await api
                .post('/api/users')
                .send(userToBeSaved)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const usersAtEnd = await usersInDB();

            expect(usersAtEnd.length).toBe(usersAtStart.length + 1);
            expect(response.body.username).toBe(userToBeSaved.username);
            done();
        });
    });

    afterAll(() => {
        mongoose.connection.end();
    });
});