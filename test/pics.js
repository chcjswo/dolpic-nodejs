const request = require('supertest');
const should = require('should');
const app = require('../routes/pics');

describe('사진을 받아오는', () => {
  it('list', (done) => {
    request(app)
      .get('/list')
      .end((err, res) => {
        res.body.should.be.json();
        done();
      });
  });
});

