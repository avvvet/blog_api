const router = require('express').Router()
const models = require('../../models')
const err_log = require('../utility/error.js')
const _ = require('lodash')
const validator = require('validator');

router.post('/', async (req, res) => {
    const data = _.pick(req.body, ['title', 'content', 'user_id'])
    if(validator.isEmpty(data.title, { ignore_whitespace: true })) return res.status(500).send({error : 'title required'})
    if(validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'content required'})
    if(data.user_id===null) return res.status(500).send({error : 'content required'})
    
    return await models.Post.create(
        data
    ).then((rslt) => {
        if(rslt) return res.status(201).send()
        throw new Error('Post not created')
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send()
    })
})

router.get('/', async (req, res) => {
    models.Post.findAll().then((rslt) => {
        if(rslt) return res.status(200).send(rslt)
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

router.put('/:id', (req, res) => {
    const data = _.pick(req.body, ['title', 'content', 'user_id'])
    if(validator.isEmpty(data.title, { ignore_whitespace: true })) return res.status(500).send({error : 'title required'})
    if(data.content!= undefined && validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'content required'})
    models.Post.update(
         data,
        { where : { id : req.params.id}}
    ).then((rslt) => {
        if(rslt && rslt[0] === 1) return res.status(200).send(rslt);
        return res.status(400).send();
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

router.delete('/:id', (req, res) => {
    models.Post.destroy(
        { where : { id : req.params.id}}
    ).then((rslt) => {
        if(rslt && rslt === 1) return res.status(200).send();
        return res.status(400).send();
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

module.exports = router