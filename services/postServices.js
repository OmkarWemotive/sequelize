const {QueryTypes} = require('Sequelize')
const db=require('../models')
const Post =db.post
const User =db.users
const Comment=db.comment
const Like=db.like
//-----------------------------------Add Operation------------------------------------------------
const addOperation = async(type,data)=>{

    try
    {
        let result
        if(type=== "post")
        {
            result = await Post.create(data)
        }
        if(type === "comment")
        {
            result = await Comment.create(data)
        }
        if(type === "like")
        {
            result = await Like.create(data)
        }
        return result
    }
    catch(e)
    {
        throw Error('Error while insert operation')
    }
}
//-----------------------------------View Post------------------------------------------------
const viewPost=async(whereCondition=NULL)=>{
    try
    {
        const data = await Post.findAll({
            attributes:['image','description'],
            include:[{
                model:User,
                attributes:['name','email']
            }],
            where:whereCondition
        })
        return data
    }
    catch(e)
    {
        throw Error('Error while fetching post')
    }
}
//-----------------------------------find user like a post or not------------------------------------------
const findLike=async(postId,userId)=>{
    const isLike=await Like.findAll({where: {post_id:postId,user_id:userId}})
    return isLike
}

//-----------------------------------update operation like,dislike,comment------------------------------------------------
const updateOperation= async(condition,whereCluse)=>{
    try
    {
        await Post.update(condition,{ where: whereCluse})
    }
    catch(e)
    {
        throw Error('Error while updating operation')
    }
}

//-----------------------------------dislike a post------------------------------------------------
const DislikeOperation= async(whereClause)=>{
    try
    {
        const like=await Like.destroy({where:whereClause})
        return like
    }
    catch(e)
    {
        throw Error('Error while dislike operation')
    }
}
//-----------------------------------Delete a post------------------------------------------------
const deletePost=async(id)=>{
    try
    {
        const post =await Post.destroy({where:{ id:id }})
        const like =await Like.destroy({where:{ post_id:id }})
        const comment =await Comment.destroy({where:{ post_id:id }})
        return {post,like,comment}
    }
    catch(e)
    {
        throw Error('Error while delete post operation')
    }
}

//-----------------------------------View Comments of post------------------------------------------------
const viewPostComment=async(id)=>{
    try
    {
        const comments = await db.sequelize.query(
        `SELECT comment.comment,user.name 
         FROM users as user,comments as comment 
         WHERE user.id=comment.user_id 
         AND comment.post_id=?`,
        {
            type:QueryTypes.SELECT,
            replacements:[id]
        })
        return comments
    }
    catch(e)
    {
        throw Error('Error while view post comments')
    }
}
//-----------------------------------View like of post------------------------------------------------
const viewPostLike=async(id)=>{
    try
    {
        const likes = await db.sequelize.query(
            `SELECT user.name 
             FROM users as user,likes as like1 
             WHERE user.id=like1.user_id 
             AND like1.post_id=?`,
            {
                type:QueryTypes.SELECT,
                replacements:[id]
            })
            return likes
    }
    catch(e)
    {
        throw Error('Error while view post likes')
    }
}
//-----------------------------------------------------------------------------------------------
module.exports={
    addOperation,
    viewPost,
    findLike,
    updateOperation,
    DislikeOperation,
    deletePost,
    viewPostComment,
    viewPostLike
}