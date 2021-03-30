const {Sequelize, Op,QueryTypes} = require('Sequelize')
const db=require('../models')
const Users =db.users
const FriendRequest=db.friendRequest

//---------------------------------Save user---------------------------------------------

const saveUser = async(data)=> {
    try
    {
        const user=await Users.create(data)
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
                },
            })
            res.status(200).json(data)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}


module.exports={
    saveUser,
    searchUser
}