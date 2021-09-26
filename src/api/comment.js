const router = require('express').Router()
const models = require('../../models')
const err_log = require('../utility/error.js')
const _ = require('lodash')
const { authUser} = require('../middleware/auth')
const validator = require('validator');
const sequelize = models.sequelize;

router.post('/:post_id', authUser, async (req, res) => {
    const data = _.pick(req.body, ['content'])
    if(_.isEmpty(data)) return res.status(400).send({error : 'required data missing'})
    if(data.content==null || validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'input valid content'})
    if(!validator.isInt(req.params.post_id)) return res.status(400).send({error : 'param is not valid'})
    data.user_id = req.user_id 
    data.post_id = req.params.post_id
    
    const t = await sequelize.transaction();
    try {
       const post = await models.Post.findOne({ where : {id: req.params.post_id}}, {transaction: t})
       if(post) {
        const comment = await models.Comment.create(data, {transaction: t})
        if(comment) {
            await t.commit()
            return res.status(201).send()
        }
        throw new Error('Comment not created')
       }
       await t.rollback()
       return res.status(400).send({error : 'No post found !'})
    } catch(e) {
        console.log(e)
       await t.rollback()
       err_log(req.method, req.url, e.message)
       res.status(500).send({error : e.message})
    }
})

/*
* POST Threaded comments - uses transaction for record integrity
*/
router.post('/:post_id/reply/:root_comment_id', authUser, async (req, res) => {
    const data = _.pick(req.body, ['content'])
    if(_.isEmpty(data)) return res.status(400).send({error : 'required data missing'})
    if(data.content==null || validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'input valid content'})
    if(!validator.isInt(req.params.post_id)) return res.status(400).send({error : 'post id param is not valid'})
    if(!validator.isInt(req.params.root_comment_id)) return res.status(400).send({error : 'root comment id param is not valid'})

    data.user_id = req.user_id 
    data.post_id = req.params.post_id
    data.root_comment_id = req.params.root_comment_id
    
    const t = await sequelize.transaction();
    
    try {

        const post = await models.Post.findOne({ where : {id: req.params.post_id}}, {transaction: t})
        if(!post) {
            await t.rollback();
            return res.status(400).send({error : 'post id is not found !'})
        }
        const root_comment = await models.Comment.findOne({ where : {id: req.params.root_comment_id}}, {transaction: t})
        if(!root_comment) {
            await t.rollback();
            return res.status(400).send({error : 'root comment id is not found !'})
        }

        const comment = await models.Comment.create(
            data, 
            { transaction: t}
        )

        if(comment) {
            let thread_data = {
                root_comment_id : data.root_comment_id,
                child_comment_id: comment.id
            }

            const comment_thread = await models.CommentThread.create(
                thread_data,
                { transaction: t}
            )

            if(comment_thread) {
                await t.commit();
                return res.status(201).send()
            }
            throw new Error('Thread comment not created')
        }
        throw new Error('Root comment not created')
    } catch (e) {
        await t.rollback();
        err_log(req.method, req.url, e.message)
        res.status(500).send({error: e.message})
    }

})

/*
*  gets all thread comments for a comment reply  
*/
router.get('/:post_id/reply/:root_comment_id', authUser, (req, res) => {
    models.Comment.findAll({
        where : { post_id: req.params.post_id},
        include: [
            {
                model: models.CommentThread,
                where : {root_comment_id : req.params.root_comment_id },
                attributes:['child_comment_id', 'root_comment_id']
            }
        ],
        order: [
            ['createdAt', 'ASC']
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

/*
*  gets all root comments for a post 
*/
router.get('/:post_id', authUser, (req, res) => {
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

router.put('/:comment_id', authUser, async (req, res) => {
    const data = _.pick(req.body, ['content'])
    if(_.isEmpty(data)) return res.status(400).send({error : 'not updated,at least one valid update params required!'})
    if(data.content!=undefined && validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(400).send({error : 'input valid content'})
    if(!validator.isInt(req.params.comment_id)) return res.status(400).send({error : 'comment id param is not valid'})
   
    try {
        const rslt = await models.Comment.update(data, {where : { id : req.params.comment_id, user_id: req.user_id}})
        if(rslt && rslt[0] === 1) return res.status(200).send(rslt);
        return res.status(400).send({error: 'not updated, invalid param or you are not authorized'});
    } catch(e) {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    }
})

router.delete('/:comment_id', authUser, (req, res) => {
    models.Comment.destroy(
        { where : { id : req.params.comment_id, user_id: req.user_id }}
    ).then((rslt) => {
        if(rslt && rslt === 1) return res.status(200).send();
        return res.status(400).send({error: 'not deleted, invalid param or you are not authorized'});
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

module.exports = router