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
const searchUser = async(userName)=>{
    try
    {
            const data=await Users.findAll({
                attributes:['id','name','email'],
                where:
                {
                    name:{[Op.like]:userName+"%" }
                }
            })
            return data
    }
    catch(e)
    {
        throw Error('Error while saving users')
    }
}
//---------------------------------Update user---------------------------------------------
const updateUser=async(data,userId)=>{
    try
    {
        const user=await Users.update(data,{
            where:{ id:userId  }
        })
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



module.exports={
    saveUser,
    searchUser,
    updateUser,
    cancleRequest
}