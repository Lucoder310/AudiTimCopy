const request = require('supertest');
const app = require('../app');

describe('GET /api/getLivePeaks', () => {
  test('returns latest peak', async () => {
    const rows = [
      { _time: 't1', _field: 'peakX', _value: 1 },
      { _time: 't1', _field: 'peakY', _value: 2 },
      { _time: 't1', _field: 'peakValue', _value: 3 }
    ];
    const iterateRows = jest.fn(async function* () {
      for (const r of rows) {
        yield { values: null, tableMeta: { toObject: () => r } };
      }
    });
    app.locals.queryApi = { iterateRows };

    const res = await request(app).get('/api/getLivePeaks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { time: 't1', peakX: 1, peakY: 2, peakValue: 3 } });
  });

  test('returns null when no data', async () => {
    const iterateRows = jest.fn(async function* () {});
    app.locals.queryApi = { iterateRows };

    const res = await request(app).get('/api/getLivePeaks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: null });
  });

  test('handles errors', async () => {
    const iterateRows = jest.fn(() => { throw new Error('fail'); });
    app.locals.queryApi = { iterateRows };

    const res = await request(app).get('/api/getLivePeaks');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error querying InfluxDB' });
  });
});
