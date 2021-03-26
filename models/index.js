const {Sequelize, DataTypes} = require('Sequelize')

const sequelize = new Sequelize('social_media','root','',{
    host:'localhost',
    dialect:'mysql',
    logging:false
})

sequelize.authenticate()
.then(()=>{
    console.log('connected...')
}).catch(e=>{
    console.log(e)
})

const db={}
db.Sequelize=Sequelize
db.sequelize=sequelize

db.sequelize.sync()
.then(()=>{
    console.log('yes re-sync')
})

db.users=require('./users')(sequelize,DataTypes)
db.post=require('./post')(sequelize,DataTypes)
db.comment=require('./commentModel')(sequelize,DataTypes)
db.like=require('./likeModel')(sequelize,DataTypes)
db.friendRequest=require('./friendRequestMoldel')(sequelize,DataTypes)


// db.users.hasOne(db.post,{foreignKey:'user_id',as:'postdetails'})
db.users.hasMany(db.post,{foreignKey:'user_id',as:'postdetails'})
db.post.belongsTo(db.users,{foreignKey:'user_id'})

db.post.hasMany(db.comment,{foreignKey:'post_id',as:'allComment'})
db.post.hasMany(db.like,{foreignKey:'post_id',as:'alllike'})

db.comment.belongsTo(db.post)
// db.comments.hasMany(db.users,{foreignKey:'user_id',as:'allComment'})

// db.friendRequest.hasMany(db.users)
// db.friendRequest.belongsTo(db.users)
// db.users.belongsTo(db.friendRequest)

module.exports=db