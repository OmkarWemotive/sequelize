const {Sequelize, Op,QueryTypes} = require('Sequelize')
const db=require('../models')
const Post =db.post
const User =db.users
const Comment=db.comment
const Like=db.like
//-----------------------------------Add Post------------------------------------------------
const addPost = async(req,res)=>{

    try
    {
        const data={
            "image":'/img/'+req.file.originalname,
            "description":req.body.description
            ,
            "user_id":req.user.id
        }
        const post=await Post.create(data)
        res.status(200).send(post)

    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------View my Post------------------------------------------------
const viewPost=async(req,res)=>{
    try
    {
        const data = await Post.findAll({
            attributes:['image','description'],
            include:[{
                model:User,
                attributes:['name','email']
            }],
            where :{post_id:req.user.id}
        })
        res.status(200).send(data)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------View all Post------------------------------------------------
const viewAllPost=async(req,res)=>{

    try
    {
        
        const data = await Post.findAll({
            attributes:['image','description'],
            include:[{
                model:User,
                attributes:['name']
            }]
        })
        res.status(200).send(data)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------comment on post------------------------------------------------
const commentPost= async(req,res)=>{
    try
    {
        await Post.update({  commentCount: Sequelize.literal('commentCount + 1') },{ where: { id: req.body.post_id }})
        const data=({
            "user_id":req.user.id,
            "post_id":req.body.post_id,
            "comment":req.body.comment
        })
        const comment=await Comment.create(data)
        res.status(200).send(comment)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------like a post------------------------------------------------
const likePost= async(req,res)=>{
    try
    {
        const isLike=await Like.findAll({where: {post_id:req.body.post_id,user_id:req.user.id}})
        if(isLike.length === 0)
        {
            await Post.update({  likeCount: Sequelize.literal('likeCount + 1') },{ where: { id: req.body.post_id }})
            const data={
                "user_id":req.user.id,
                "post_id":req.body.post_id,
            }
            const like=await Like.create(data)
            res.status(200).send(like)
        }
        else
        {
            res.status(200).send({'error':'u have already like this post'})
        }
        //res.status(200).send(isLike)
        
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------dislike a post------------------------------------------------
const dislikePost= async(req,res)=>{
    try
    {
        await Post.update({  likeCount: Sequelize.literal('likeCount - 1') },{ where: { id: req.body.post_id }})
        const dislike=await Like.destroy({where:{ user_id:req.user.id,post_id:req.body.post_id }})
        res.send({"success":"Dislike successfully"})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------Delete a post------------------------------------------------
const deletePost=async(req,res)=>{
    try
    {
        const id = req.params.id
        const post =await Post.destroy({where:{ id:id }})
        const like =await Like.destroy({where:{ post_id:id }})
        const comment =await Comment.destroy({where:{ post_id:id }})
        res.status(200).send({post, like, comment})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------View Single post By ID------------------------------------------------
const viewSinglePostById=async(req,res)=>{
    try
    {
        const userData = await User.findAll({
            attributes:['name','id'],
            include:[{
                model:Comment,
                as:'commentdetails',
                attributes:['comment','created_At']
            }],
            where :{post_id:req.body.id}
        })
    //     const comment = await db.sequelize.query(
    //  "select comment,name from users,comments where users.id=comments.user_id AND comments.post_id=?",
    //     {
    //         type:QueryTypes.SELECT,
    //         replacements:[req.body.id]
    //     })


        res.status(200).send(userData)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------View Comments of post------------------------------------------------
const viewPostComment=async(req,res)=>{
    try
    {
        const comments = await db.sequelize.query(
        `SELECT comment.comment,user.name 
         FROM users as user,comments as comment 
         WHERE user.id=comment.user_id 
         AND comment.post_id=?`,
        {
            type:QueryTypes.SELECT,
            replacements:[req.body.id]
        })
        res.status(200).send(comments)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------View like of post------------------------------------------------
const viewPostLike=async(req,res)=>{
    try
    {
        const likes = await db.sequelize.query(
            `SELECT user.name 
             FROM users as user,likes as like1 
             WHERE user.id=like1.user_id 
             AND like1.post_id=?`,
            {
                type:QueryTypes.SELECT,
                replacements:[req.body.id]
            })
            res.status(200).send(likes)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//-----------------------------------------------------------------------------------------------
module.exports={
    addPost,
    viewPost,
    viewAllPost,
    commentPost,
    likePost,
    dislikePost,
    deletePost,
    viewSinglePostById,
    viewPostComment,
    viewPostLike
}