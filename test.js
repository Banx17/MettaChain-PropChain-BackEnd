const app = require('./server');
const request = require('supertest');

describe('Facebook OAuth2 API', () => {
  it('should return API message on root', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('MettaChain PropChain Backend API');
  });

  it('should return 401 for profile without authentication', async () => {
    const response = await request(app).get('/profile');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authenticated');
  });

  it('should return 401 for link-facebook without authentication', async () => {
    const response = await request(app).post('/auth/link-facebook');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authenticated');
  });

  it('should return 401 for sync-profile without authentication', async () => {
    const response = await request(app).post('/auth/sync-profile');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authenticated');
  });
});