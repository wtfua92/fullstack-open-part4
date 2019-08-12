const mongoose = require('mongoose');
const supertest = require('supertest');

const {users} = require('../utils/testhelpers/user_test_helper');
const app = require('../app');

const api = supertest(app);

describe('Login API', () => {
    test('should return user info and token upon successful login', async () => {
        const response = (await api
            .post('/api/login')
            .send(users[0])
            .expect(200)
            .expect('Content-Type', /application\/json/)).body;

        expect(response.token).toBeDefined();
        expect(response.username).toBe(users[0].username);
    });

    test('should return 401 if password is wrong', async () => {
        await api
            .post('/api/login')
            .send({
                username: 'lolo',
                password: 'lololo'
            })
            .expect(401)
            .expect('Content-Type', /application\/json/);
    });

    afterAll(() => {
        mongoose.connection.end();
    });
});