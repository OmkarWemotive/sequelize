const bcrypt =require('bcryptjs')
const jwt =require('jsonwebtoken')

module.exports=(sequelize,Datatypes)=>{

    const Users=sequelize.define('users',{
        name:
        {
            type:Datatypes.STRING,
            allowNull: false
        },
        email:
        {
            type:Datatypes.STRING,
            allowNull: false,
            unique: true
        },
        password:
        {
            type:Datatypes.STRING
        },
        mobile:
        {
            type:Datatypes.STRING
        },
        dob:
        {
            type:Datatypes.DATE
        },
        gender:
        {
            type:Datatypes.STRING
        },
        token:
        {
            type:Datatypes.STRING
        }
    })

    // Users.addHook('beforeValidate','customName',(user,option)=>{
    //     user.password = bcrypt.hash(user.password,8)
    // })

    Users.prototype.generateAuthToken=async function()
    {
        const user =this
        const token = jwt.sign({id:user.id},'thisisnodedemo')
        await Users.update({token:token},{  where:{ id:user.id } })
        return token
    }
    Users.findByCredentials=async(email,password)=>{
        const user = await Users.findOne({ where: { email: email } })
        if(!user)
        {
            throw new Error('Unable to Login')
        }
        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch)
        {
            throw new Error('Wrong Password')
        }
        return user
    }

    Users.checkPassword=async(password,userpassword)=>{
        
        password= await bcrypt.hash(password,8)
        const isMatch= await bcrypt.compare(password,userpassword)
        if(!isMatch)
        {
            throw new Error('Wrong Password')
        }
        return true
    }


    return Users
}