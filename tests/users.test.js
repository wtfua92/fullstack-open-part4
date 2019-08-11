const mongoose = require('mongoose');
const supertest = require('supertest');

const {users, usersInDB} = require('../utils/testhelpers/user_test_helper');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

describe('User Controller', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const usersToSave = users.map(u => {
            const user = new User(u);
            return user.save();
        });

        await Promise.all(usersToSave);
    });

    describe('GET', () => {
        test('should return users', async () => {
            const response = await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(response.body.length).toBe(users.length);
            expect(response.body[0].password).toBeUndefined();
            expect(response.body[0].id).toBeDefined();
        });
    });

    describe('POST', () => {
        test('should return 400 if username is not unique', async () => {
            await api
                .post('/api/users')
                .send(users[0])
                .expect(400)
                .expect('Content-Type', /application\/json/);
        });

        test('should return 201 and user object after saving', async () => {
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
        });
    });

    afterAll(() => {
        mongoose.connection.end();
    });
});