import express, {Request,Response,Application} from 'express';
const app:Application = express();
const host = '127.0.0.1'
const port = process.env.PORT || 4000
const http = require('http').createServer(app)
const postApi = require('./api/post')
const commentApi = require('./api/comment')

//routes
app.use(express.json())
app.use('/api/v1/posts', postApi);
app.use('/api/v1/comments', commentApi);
app.get('/', (req: Request, res: Response) => {
    interface StatusInterface {
        status: string,
        date: Date
    }
    const status : StatusInterface = {
        status : 'api server running',
        date: new Date()
    }
    res.status(200).send(status)
})

http.listen(port, host, (): void => {
    console.log(`server runing at http://${host}:${port}/`);
})

module.exports = http

