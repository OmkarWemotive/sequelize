const {Sequelize, Op,QueryTypes} = require('Sequelize')
const db=require('../models')
const Users =db.users
const FriendRequest=db.friendRequest

//---------------------------------Save Operation---------------------------------------------

const saveUser = async(modelName,data)=> {
    try
    {
        let user
        if(modelName === "Users")
        {
            user=await Users.create(data)
        }
        if(modelName === "friend")
        {
            user=await FriendRequest.create(data)
        }
        return user
    }
    catch(e)
    {
        throw Error('Error while saving users')
    }
}
//---------------------------------Search user---------------------------------------------
const fetchUser = async(where=NULL)=>{
    try
    {
        // attributes:['id','name','email']
            const data=await Users.findAll(where)
            return data
    }
    catch(e)
    {
        throw Error('Error while saving users')
    }
}
//---------------------------------Update Operation---------------------------------------------
const updateActivity=async(modelName,data,where)=>{
    try
    {
        let user
        if(modelName === "user")
        {
            user=await Users.update(data,where)
        }
        if(modelName === "friend")
        {
            user=await FriendRequest.update(data,where)
        }
        return user
    }
    catch(e)
    {
        throw Error('Error while updating users')
    }
}
//---------------------------------cancle and reject request--------------------------------
const cancleRequest = async(dataObject)=>{
    try
    {
        const reqStatus=await FriendRequest.destroy({where:dataObject})
        return reqStatus
    }
    catch(e)
    {
        throw Error('Error while rejecting request')
    }
}
//---------------------------coming Friend Request----------------------------------------------
const myRequest=async(reqStatus,userId)=>{
    try
    {
        const data = await db.sequelize.query(
            `SELECT user.name, user.id 
             FROM users as user,frindrequests as fr
             WHERE user.id=fr.sender_id 
             AND fr.status= ?
             AND fr.receiver_id = ?`,
            {
                type:QueryTypes.SELECT,
                replacements:[reqStatus,userId]
            })
        return data
    }
    catch(e)
    {
        throw Error('Error while rejecting request')
    }
}


module.exports={
    saveUser,
    fetchUser,
    updateActivity,
    cancleRequest,
    myRequest
}