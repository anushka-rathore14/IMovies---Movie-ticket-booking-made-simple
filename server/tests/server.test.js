const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { app, server } = require('../index');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Movie = require('../models/Movie');

test('IMovies Server Test Suite', async (t) => {
  let testServer;
  let baseUrl;

  t.before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await new Promise((resolve) => {
      testServer = app.listen(0, () => {
        const port = testServer.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  t.after(async () => {
    if (testServer) {
      await new Promise((resolve) => testServer.close(resolve));
    }
    await disconnectDB();
  });

  await t.test('GET /api/health should return online status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.service, 'IMovies API & Realtime Gateway');
  });

  await t.test('POST /api/auth/register should create a new user', async () => {
    const uniqueEmail = `testuser_${Date.now()}@test.com`;
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Unit Tester',
        email: uniqueEmail,
        password: 'Password123',
      }),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, uniqueEmail);
  });

  await t.test('POST /api/auth/login should authenticate user with correct credentials', async () => {
    const uniqueEmail = `logintest_${Date.now()}@test.com`;
    await User.create({
      name: 'Login Tester',
      email: uniqueEmail,
      password: 'MyPassword123',
    });

    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'MyPassword123',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.name, 'Login Tester');
  });

  await t.test('GET /api/movies should return movie list', async () => {
    await Movie.create({
      title: 'Test Movie Alpha',
      description: 'An epic space odyssey',
      genre: ['Sci-Fi'],
      language: 'English',
      duration: 120,
      posterUrl: 'https://example.com/poster.jpg',
      backdropUrl: 'https://example.com/backdrop.jpg',
    });

    const res = await fetch(`${baseUrl}/api/movies`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.movies));
    assert.ok(data.movies.length >= 1);
  });
});
