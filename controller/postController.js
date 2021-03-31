const {Sequelize} = require('Sequelize')
const postSerice = require('../services/postServices')


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
        const post=await postSerice.addOperation("post",data)
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
        const where ={user_id:req.user.id}
        const data = await postSerice.viewPost(where)
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
        const data = await postSerice.viewPost(null)
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
        const data=({
            "user_id":req.user.id,
            "post_id":req.body.post_id,
            "comment":req.body.comment
        })
        const comment=await postSerice.addOperation("comment",data)
        await postSerice.updateOperation({ commentCount: Sequelize.literal('commentCount + 1') },{ id: req.body.post_id })
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
        //check here : this user is like this post or not
        const isLike=await postSerice.findLike(req.body.post_id,req.user.id)

        //if not then like this post
        if(isLike.length === 0)
        {
            //increament count in post tbl
            const data={
                "user_id":req.user.id,
                "post_id":req.body.post_id,
            }
            const like=await postSerice.addOperation("like",data)
            await postSerice.updateOperation({ likeCount: Sequelize.literal('likeCount + 1') },{ id: req.body.post_id })
            res.status(200).send(like)
        }
        //if not then send message
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
        const result=await postSerice.DislikeOperation({ user_id:req.user.id,post_id:req.body.post_id })
        await postSerice.updateOperation({ likeCount: Sequelize.literal('likeCount - 1') },{ id: req.body.post_id })
        res.send(result,{"success":"Dislike successfully"})
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
        const result =await postSerice.deletePost(req.params.id)
        res.status(200).send(result)
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
        const comments = await postSerice.viewPostComment(req.body.id)
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
        const likes = await postSerice.viewPostLike(req.body.id)
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
    viewPostComment,
    viewPostLike
}