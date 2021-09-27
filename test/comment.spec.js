const mocha = require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');
const expect = chai.expect;
const describe = mocha.describe
const it = mocha.it
chai.use(chaiHttp);

    
describe('POST /api/v1/comments/:post_id', () => {
    it("should create a comment for a post with response status 201", async () => {
        const body = {
            user_id: 2225,
            content: "Post content",
        }
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let post_id = 1;
        const res = await chai
                    .request(app)
                    .post('/api/v1/comments/' + post_id)
                    .set({ "x-auth": token })
                    .send(body);
        expect(res.status).to.equal(201);
    });
});

describe('POST /api/v1/comments/:post_id', () => {
    it("should return required data missig when empty input sent", async () => {
        const body = {}
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let post_id = 1;
        const res = await chai
                    .request(app)
                    .post('/api/v1/comments/' + post_id)
                    .set({ "x-auth": token })
                    .send(body);
        expect(res.status).to.equal(400);
    });
});

describe('POST /api/v1/comments/:post_id', () => {
    it("should return post id param not valid", async () => {
        const body = {}
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let post_id = "xyz";
        const res = await chai
                    .request(app)
                    .post('/api/v1/comments/' + post_id)
                    .set({ "x-auth": token })
                    .send(body);
        expect(res.status).to.equal(400);
    });
});

describe('POST /api/v1/comments/:post_Id', () => {
    it("should return unauthorized with code status 401", async () => {
        const body = {
            content: "comment",
        }
        let token = ''
        let post_id = 1
        const res = await chai.
                    request(app)
                    .post('/api/v1/comments/' + post_id)
                    .set({ "x-auth": token })
                    .send(body);
        expect(res.status).to.equal(401);
    });
});

describe('GET /api/v1/comments/:post_id', () => {
    it("It should Get all root comments for a post", async () => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let post_id = 1;
        const res = await chai.
                    request(app)
                    .get('/api/v1/comments/' + post_id)
                    .set({ "x-auth": token })
        expect(res.status).to.equal(200);
    });
});

describe('PUT /api/v1/comments/:comment_id', () => {
    it("It should update a comment", async () => {
        let body ={
            content: "comment edited"
        }
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo3Nzc1LCJpYXQiOjE2MzIzMDgwOTd9.sznrK_93VShz_1jAdj8-TbKoAf6j2pvfpNWrWb4Pncw'
        let comment_id = 1;
        const res = await chai.
                    request(app)
                    .put('/api/v1/comments/' + comment_id)
                    .set({ "x-auth": token })
                    .send(body)
        expect(res.status).to.equal(200);
    });
});

describe('PUT /api/v1/comments/:comment_id', () => {
    it("It should response not updated, at least a valid update body required!", async () => {
        let body ={}
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let comment_id = 1;
        const res = await chai.
                    request(app)
                    .put('/api/v1/comments/' + comment_id)
                    .set({ "x-auth": token })
                    .send(body)
        expect(res.status).to.equal(400);
    });
});

describe('DELETE /api/v1/comments/:comment_id', () => {
    it("It should reply not deleted , due to bad param or not authorized", async () => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let comment_id = 1;
        const res = await chai.
                request(app)
                .delete('/api/v1/comments/' + comment_id)
                .set({ "x-auth": token })
        expect(res.status).to.equal(400);
    });
});

describe('DELETE /api/v1/comments/:comment_id', () => {
    it("It should reply not deleted , due to bad param or not authorized", async () => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo3Nzc1LCJpYXQiOjE2MzIzMDgwOTd9.sznrK_93VShz_1jAdj8-TbKoAf6j2pvfpNWrWb4Pncw'
        let comment_id = 1;
        const res = await chai.
                request(app)
                .delete('/api/v1/comments/' + comment_id)
                .set({ "x-auth": token })
        expect(res.status).to.equal(200);
    });
});


