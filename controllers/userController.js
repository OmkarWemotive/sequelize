const {Sequelize, Op} = require('Sequelize')
const db=require('../models')
const Users =db.users

const addUser =async(req,res)=>{

    // const data=await Users.build({name:"omkar",email:"omkar@g.com"})
    // const response= await data.save()
    const response=await Users.create({name:"akshy",email:"akshy@g.com"})
    
    //update
    //modified data values
    //response.name='akshay' 
    //get inserted values on cmd
    //console.log(response.dataValues)

    //delete
    //response.destroye()
    //console.log(response.dataValues)

    //reload
    //response.name='raj'
    //response.reload()
    res.status(200).json(response)
}

const crudOperation=async(req,res)=>{

    //insert
    //const response=await Users.create({name:"akshy",email:"akshy@g.com",gender:"Male"})

    //update
    // const response=await Users.update({name:"soham"},{
    //     where:{
    //         id:2
    //     }
    // })

    // delete
    // const response=await Users.destroy({
    //     where:{
    //         id:2
    //     }
    // })

    //truncate
    // const response=await Users.destroy({
    //     truncate:true
    // })

    //bulk insert
    // const response=await Users.bulkCreate([
    //     {name:"xyz",email:"xyz@g.com",gender:"Male"},
    //     {name:"pqr",email:"pqr@g.com",gender:"Male"},
    //     {name:"abc",email:"abc@g.com",gender:"Male"}
    // ])

    //find All 
    // const response=await Users.find({})
    // const response=await Users.findAll({})

    //find one 
    // const response=await Users.findOne({})

    res.status(200).json(response)
}

const queryData=async(req,res)=>
{
    // const response=await Users.create({name:"akshy",email:"akshy@g.com",gender:"Male"},{
    //     fields:['name','email']
    // })

    //select
    // const response=await Users.findAll({
    //     attributes:['name',['email','emailId'],
    //         [Sequelize.fn('Count',Sequelize.col('email')),'emailCount'],
    //         [Sequelize.fn('CONCAT',Sequelize.col('email'),'test'),'newEmail']
    //     ]
    // })

    //include , exclude
    // const response=await Users.findAll({
    //     attributes:{
    //         exclude:['updatedAt'],  // he resp la nkoy so 
    //         // include: [Sequelize.fn('CONCAT',Sequelize.col('name'),' rokade'),'fullname']
    //     }
    // })

    //condition
    // const response=await Users.findAll({
    //     where:
    //     {
    //         // id:{[Op.gt]:0},
    //         id:{[Op.like]:'%g.com'}
    //     },
    //     order:
    //     [
    //         ['name','DESC']
    //     ],
    //     group:['name'],
    //     limit:2, //pr page record
    //     offset:1, //first record sodun pudche

    // })

    //count
    const response=await Users.count({})

    res.status(200).json(response)
}

const setGet=async(req,res)=>{

    // let response=await Users.create({name:"akshy",email:"akshy@g.com",gender:"Male"})
    // const resp={ response:'setter-getter'}

    const response=await Users.findAll({})
    const resp={ response:response}

    res.status(200).json(resp)
}

module.exports={
    addUser,
    crudOperation,
    queryData,
    setGet
}