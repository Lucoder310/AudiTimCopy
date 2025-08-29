const request = require('supertest');
const app = require('../app');

describe('POST /api/sensorRange', () => {
  test('validates body', async () => {
    const res = await request(app).post('/api/sensorRange').send({});
    expect(res.status).toBe(400);
  });

  test('calculates averages', async () => {
    const iterateRows = jest.fn(async function* () {
      for (let i = 0; i < 12; i++) {
        yield { values: null, tableMeta: { toObject: () => ({ _field: 's1', _value: 1, _time: `t${i}` }) } };
      }
    });
    app.locals.queryApi = { iterateRows };

    const res = await request(app)
      .post('/api/sensorRange')
      .send({ start: 0, stop: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { s1: [ { time: 't5', value: 1 }, { time: 't11', value: 1 } ] } });
  });

  test('handles errors', async () => {
    const iterateRows = jest.fn(() => { throw new Error('fail'); });
    app.locals.queryApi = { iterateRows };

    const res = await request(app)
      .post('/api/sensorRange')
      .send({ start: 0, stop: 1 });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error querying InfluxDB' });
  });
});
