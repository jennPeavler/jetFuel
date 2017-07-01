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

      //NOTE: Can insert a new assertion:  Get folders from database and then test to make sure new one is there
    })

    it('should not insert blank folder', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send('this is garbage')
      .end((err, response) => {
        response.should.have.status(500)
        // response.body.should.have.property('name')
        // response.body.name.should.equal('Bull')
        // response.body.should.have.property('urls')
        // response.body.urls.length.should.equal(2)

        done()
      })
    })


  })

  describe('GET /api/v1/folders/:id/urls', () => {
    it('should get the urls of a given folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1/urls')
      .end((err, response) => {
        response.should.have.status(200)
        response.body.should.be.an('array')
        response.body.length.should.equal(3)
        response.body[0].url.should.equal('google.com')
        response.body[1].url.should.equal('pinball.com')
        response.body[2].url.should.equal('kinggeorge.com')
        done()
      })
    })
  })

  describe('POST /urls', () => {
    it('should insert new url into a folder', (done) => {
      chai.request(server)
      .post('/api/v1/urls')
      .send({
        url: 'theoatmeal.com',
        description: 'comic',
        folder_id: 1
      })
      .end((err, response) => {
        response.should.have.status(201)
        console.log(response.body)
        response.body.should.be.an('array')
        response.body.length.should.equal(1)
        response.body[0].should.equal(7)
        done()
      })
    })

    it('should not insert new url into a non-existing folder', (done) => {
      chai.request(server)
      .post('/api/v1/urls')
      .send({
        url: 'theoatmeal.com',
        description: 'comic',
        folder_id: 7
      })
      .end((err, response) => {
        response.should.have.status(404)
        response.body.error.should.equal('Can not add a url to a non-existing folder')
        done()
      })
    })
  })

  describe('PUT /urls/:id', () => {
    it('should increment popularity ', (done) => {
      chai.request(server)
      .put('/api/v1/urls/1')
      .end((err, response) => {
        response.should.have.status(202)
        done()
      })
    })
  })

  describe('GET /:id', () => {
    it('reroute long link ', (done) => {
      chai.request(server)
      .get('/1')
      .end((err, response) => {
        response.should.have.status(200)
        done()
      })
    })
  })


});
