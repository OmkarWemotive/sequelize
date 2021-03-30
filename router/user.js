const bcrypt =require('bcryptjs')
const {Sequelize, Op,QueryTypes} = require('Sequelize')
const db=require('../models')
const Users =db.users
const FriendRequest=db.friendRequest
const userService=require('../services/userServices')

//--------------------------------Save User In System----------------------------------
const saveUser =async(req,res)=>{
    try
    {
        req.body.password= await bcrypt.hash(req.body.password,8)
        const user=await userService.saveUser(req.body)
        const token= await user.generateAuthToken()
        res.status(201).json({"token":token})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
}
//--------------------------------Login User----------------------------------
const loginUser =async(req,res)=>{

    try
    {
        const user=await Users.findByCredentials(req.body.email,req.body.password)
        res.status(200).json({"token":user.token})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
}
//--------------------------------Logout User----------------------------------
const logoutUser=async(req,res)=>{

    try
    {
        res.status(200).json({"success":"logout successfully"})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
}

//--------------------------------View My Profile---------------------------------
const viewUser=async(req,res)=>{
    try
    {
        res.status(200).json(req.user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//--------------------------------Search User---------------------------------
const searchUser = async(req,res)=>{
    try
    {
            const data=await Users.findAll({
                attributes:['id','name','email'],
                where:
                {
                    name:{[Op.like]:req.body.name+"%" }
                },
            })
            res.status(200).json(data)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//---------------------------update user----------------------------------------------

const updateUser=async(req,res)=>{
    try
    {
        const data={
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            dob:req.body.dob,
            gender:req.body.gender
        }

        const user=await Users.update(data,{
            where:{ id:req.user.id  }
        })
        res.status(200).json(user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//---------------------------Send Friend Request----------------------------------------------
const sendRequest=async(req,res)=>{
    try
    {
        const data={sender_id:req.user.id,receiver_id:req.body.id}
        const user=await FriendRequest.create(data)
        res.status(200).send(user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//---------------------------Cancel Friend Request----------------------------------------------
const cancleRequest=async(req,res)=>{
    try
    {
        const reqStatus= FriendRequest.destroy({where:{ sender_id:req.user.id,receiver_id:req.body.id }})
        res.status(200).send(reqStatus)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//---------------------------Accept/Reject Friend Request----------------------------------------------
const requestStatus=async(req,res)=>{
    try
    {
        let reqStatus
        //accept request : 1
        if(req.body.status === 1)
        {
            reqStatus=await FriendRequest.update({status : 1},{
                where:{ sender_id:req.body.id,receiver_id:req.user.id  }
            })
        }
        //reject request : 2
        if(req.body.status === 2)
        {
            reqStatus = FriendRequest.destroy({where:{ sender_id:req.body.id,receiver_id:req.user.id }})
        }
        res.status(200).send(reqStatus)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//---------------------------coming Friend Request----------------------------------------------
const myRequest=async(req,res)=>{
    try
    {
        const data = await db.sequelize.query(
            `SELECT user.name, user.id 
             FROM users as user,frindrequests as fr
             WHERE user.id=fr.sender_id 
             AND fr.status= 0
             AND fr.receiver_id = ?`,
            {
                type:QueryTypes.SELECT,
                replacements:[req.user.id]
            })
        res.status(200).json(data)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//------------------------------My Friends----------------------------------------------
const myFriends=async(req,res)=>{
    try
    {
        const data = await db.sequelize.query(
            `SELECT user.name 
             FROM users as user,frindrequests as fr
             WHERE user.id=fr.sender_id 
             AND fr.status= 1
             AND fr.receiver_id = ?`,
            {
                type:QueryTypes.SELECT,
                replacements:[req.user.id]
            })
         
        res.status(200).json(data)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//----------------------------------Reset Password-----------------------------------
const resetPasswordUser = async(req,res)=>{
    try
    {
        const oldPassword = req.body.oldPass
        const newPassword = req.body.newPass

        const user=await Users.checkPassword(oldPassword,req.user.password)
        if(user.length === 0)
        {
            res.status(400).json({"Error":"Password wrong"})
        }

        console.log(oldPassword,newPassword)

        newPassword= await bcrypt.hash(newPassword,8)
        const isUpdte=await Users.update({password:newPassword},{ where:{ id:req.user.id  } })
        res.status(200).send(isUpdte)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}
//----------------------------------All Users-----------------------------------
const allUser = async(req,res)=>{
    try
    {
        const data=await Users.findAll({
            attributes:['id','name','email']
        })
        res.status(200).json(data)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
}



//---------------------------------------------------------------------------------------
module.exports={
    saveUser,
    loginUser,
    viewUser,
    searchUser,
    updateUser,
    logoutUser,
    sendRequest,
    cancleRequest,
    requestStatus,
    myRequest,
    myFriends,
    resetPasswordUser,
    allUser
}