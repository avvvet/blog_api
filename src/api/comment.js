const router = require('express').Router()
const models = require('../../models')
const err_log = require('../utility/error.js')
const _ = require('lodash')
const validator = require('validator');

router.post('/', async (req, res) => {
    const data = _.pick(req.body, ['content', 'post_id', 'user_id'])
    if(validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'title required'})
    if(data.post_id===null) return res.status(500).send({error : 'post id required'})
    if(data.user_id===null) return res.status(500).send({error : 'user id required'})
    
    return await models.Comment.create(
        data
    ).then((rslt) => {
        if(rslt) return res.status(201).send()
        throw new Error('Comment not created')
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send()
    })
})

router.get('/:post_id', async (req, res) => {
    models.Comment.findAll({
        where : { post_id: req.params.post_id},
        include: [
            {
                model: models.Post,
                required: true
            }
        ],
        order: [
            ['createdAt', 'DESC']
          ],
          raw: true,
          nest: true
    }).then((rslt) => {
        if(rslt) return res.status(200).send(rslt)
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

router.put('/:comment_id', (req, res) => {
    const data = _.pick(req.body, ['content', 'user_id'])
    if(validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'title required'})
    if(data.user_id===null) return res.status(500).send({error : 'user id required'})
    
    models.Comment.update(
         data,
        { where : { id : req.params.comment_id}}
    ).then((rslt) => {
        if(rslt && rslt[0] === 1) return res.status(200).send(rslt);
        return res.status(400).send();
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

router.delete('/:comment_id', (req, res) => {
    models.Comment.destroy(
        { where : { id : req.params.comment_id}}
    ).then((rslt) => {
        if(rslt && rslt === 1) return res.status(200).send();
        return res.status(400).send();
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

module.exports = router