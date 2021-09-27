const mocha = require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../src/server');
const describe = mocha.describe
const it = mocha.it
chai.use(chaiHttp);

describe('POST /api/v1/posts', () => {
    it("should return post created with code status 201", async () => {
        const body = {
            title: "Post title",
            content: "Post content",
        }
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        const res = await chai.
                    request(app)
                    .post('/api/v1/posts')
                    .set({ "x-auth": token })
                    .send(body);
        expect(res.status).to.equal(201);
    });
});

describe('POST /api/v1/posts', () => {
    it("should return unauthorized with code status 401", async () => {
        const body = {
            title: "Post title",
            content: "Post content",
        }
        let token = ''
        const res = await chai.
                    request(app)
                    .post('/api/v1/posts')
                    .set({ "x-auth": token })
                    .send(body);
        expect(res.status).to.equal(401);
    });
});

describe('PUT /api/v1/posts/:post_id', () => {
    it("It should update a post", async () => {
        let body ={
            title: "post title",
            content: "post content"
        }
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let post_id = 1;
        const res = await chai.
                    request(app)
                    .put('/api/v1/posts/' + post_id)
                    .set({ "x-auth": token })
                    .send(body)
        expect(res.status).to.equal(200);
    });
});

describe('PUT /api/v1/posts/:post_id', () => {
    it("It should response not updated, at least a valid update body required!", async () => {
        let body ={}
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let post_id = 1;
        const res = await chai.
                    request(app)
                    .put('/api/v1/posts/1' + post_id)
                    .set({ "x-auth": token })
                    .send(body)
        expect(res.status).to.equal(400);
    });
});

describe('DELETE /api/v1/posts/:post_id', () => {
    it("It should delet a post", async () => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        let post_id = 2;
        const res = await chai.
                request(app)
                .delete('/api/v1/posts/' + post_id)
                .set({ "x-auth": token })
        expect(res.status).to.equal(200);
    });
});