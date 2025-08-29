const request = require('supertest');
const app = require('../app');

describe('GET /api/sensorRange', () => {
  test('returns oldest and newest timestamps', async () => {
    const iterateRows = jest.fn()
      .mockImplementationOnce(async function* () {
        yield { values: null, tableMeta: { toObject: () => ({ _time: 'old' }) } };
      })
      .mockImplementationOnce(async function* () {
        yield { values: null, tableMeta: { toObject: () => ({ _time: 'new' }) } };
      });
    app.locals.queryApi = { iterateRows };

    const res = await request(app).get('/api/sensorRange');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ oldest: 'old', newest: 'new' });
    expect(iterateRows).toHaveBeenCalledTimes(2);
  });

  test('handles errors', async () => {
    const iterateRows = jest.fn(() => { throw new Error('fail'); });
    app.locals.queryApi = { iterateRows };

    const res = await request(app).get('/api/sensorRange');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error querying InfluxDB' });
  });
});
