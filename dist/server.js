"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const host = '127.0.0.1';
const port = process.env.PORT || 4000;
const http = require('http').createServer(app);
const postApi = require('./api/post');
const commentApi = require('./api/comment');
//routes
app.use(express_1.default.json());
app.use('/api/v1/posts', postApi);
app.use('/api/v1/comments', commentApi);
app.get('/', (req, res) => {
    res.status(200).send({
        server_status: 'api server running',
        date: new Date().toString()
    });
});
http.listen(port, host, () => {
    console.log(`server runing at http://${host}:${port}/`);
});
module.exports = http;
