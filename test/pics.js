const request = require('supertest');
const should = require('should');
const app = require('../app');

describe('사진을 받아오는', () => {
  it('test', (done) => {
    request(app)
      .get('/pics/test')
      .expect(404)
      .end(done);
  });
});

// describe('사진을 받아오는', () => {
//   it('list', (done) => {
//     request(app)
//       .get('/pics/list/1')
//       .end((err, res) => {
//         res.body.should.have.property('pages', 1);
//         done();
//       });
//   });
// });