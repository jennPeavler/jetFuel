process.env.NODE_ENV = 'test'
const environment = 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server/server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      // response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });
});

describe('API Routes', () => {

  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done()
        })
      })
    })
  });

  describe('GET /api/v1/folders', () => {
    it('should return all folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.length.should.equal(2)
        response.body[0].should.have.property('name')
        response.body[0].name.should.equal('chicago')
        response.body[1].name.should.equal('pinball')
        response.body[0].should.have.property('id')
        response.body[0].id.should.equal(1)
        done()
      })
    })
  })

  describe('POST /api/v1/folders', () => {
    it('should insert new folder into database', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({name: 'Bull',
            urls: [
              {url: 'google.com', description: 'duh'},
              {url: 'reddit.com', description: 'boom'},
            ]})
      .end((err, response) => {
        response.should.have.status(201)
        response.body.should.have.property('name')
        response.body.name.should.equal('Bull')
        response.body.should.have.property('urls')
        response.body.urls.length.should.equal(2)

        done()
      })
    })

  })

});
