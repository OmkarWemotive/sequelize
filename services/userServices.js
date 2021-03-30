const {Sequelize, Op,QueryTypes} = require('Sequelize')
const db=require('../models')
const Users =db.users
const FriendRequest=db.friendRequest

const saveUser = async(data)=> {
    try
    {
        const user=await Users.create(data)
        return user
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}

module.exports={
    saveUser
}