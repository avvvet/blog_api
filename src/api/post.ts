import express, {Request,Response} from 'express';
import '../utility/error'
const router = express.Router()
const models = require('../../models')
const _ = require('lodash')
const validator = require('validator');
const { authUser} = require('../middleware/auth')

interface PostInterface {
    title: number,
    user_id: number,
    content: string
}

router.post('/', authUser, (req: Request | any, res: Response) => {
    const data = _.pick(req.body, ['title', 'content'])
    if(_.isEmpty(data)) return res.status(400).send({error : 'required data missing'})
    if(data.title==null || validator.isEmpty(data.title, { ignore_whitespace: true })) return res.status(500).send({error : 'input valid title'})
    if(data.content==null || validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'input valid content'})
    
    data.user_id = req.user_id //from auth
    models.Post.create(
        data
    ).then((posts: [] | PostInterface) => {
        if(posts) return res.status(201).send()
        throw new Error('Post not created')
    }).catch((e: any) => {
        ErrorLog(req.method + ':' + req.url, e.message)
        res.status(500).send()
    })
})

router.get('/', authUser, (req: Request | any, res: Response) => {
    models.Post.findAll({
        where : { user_id: req.user_id},
    }).then((posts: [] | PostInterface) => {
        if(posts) return res.status(200).send(posts)
    }).catch((e: any) => {
        ErrorLog(req.method + ':' + req.url, e.message)
        res.status(500).send();
    });
})

router.put('/:id', authUser, (req: Request | any, res: Response) => {
    const data = _.pick(req.body, ['title', 'content'])
    if(_.isEmpty(data)) return res.status(400).send({error : 'not updated,at least one valid update params required!'})
    if(data.title!=undefined && validator.isEmpty(data.title, { ignore_whitespace: true })) return res.status(400).send({error : 'input valid title'})
    if(data.content!=undefined && validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(400).send({error : 'input valid content'})
    if(!validator.isInt(req.params.id)) return res.status(400).send({error : 'post id param is not valid'})
    data.user_id = req.user_id 
    
    models.Post.update(
         data,
        { where : { id : req.params.id, user_id: data.user_id}}
    ).then((posts: [number]) => {
        if(posts && posts[0] === 1) return res.status(200).send(posts);
        return res.status(400).send({error: 'not updated, invalid param or you are not authorized'});
    }).catch((e: any) => {
        ErrorLog(req.method + ':' + req.url, e.message)
        res.status(500).send();
    });
})

router.delete('/:id', authUser, (req: Request | any, res: Response) => {
    models.Post.destroy(
        { 
            where : { id : req.params.id, user_id: req.user_id }
        }
    ).then((posts: number) => {
        if(posts && posts === 1) return res.status(200).send();
        return res.status(400).send({error: 'not deleted, bad param or not authorized!'});
    }).catch((e: any) => {
        ErrorLog(req.method + ':' + req.url, e.message)
        res.status(500).send({error : 'first delete comments!'});
    });
})

module.exports = router