const mocha = require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');
const describe = mocha.describe
const it = mocha.it

chai.use(chaiHttp);
chai.should();
describe('api http server status', ()=> {
    describe('GET /', () => {
        it("should return status 200", (done) => {
            chai.request(app)
                .get('/').end((e, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })
})