
module.exports=(sequelize,Datatypes)=>{

    const Post=sequelize.define('post',{
        image:
        {
            type:Datatypes.STRING,
            allowNull: false
        },
        description:
        {
            type:Datatypes.STRING,
            allowNull: false,
            unique: true
        }
        ,
        user_id:
        {
            type:Datatypes.INTEGER
        },
        likeCount:
        {
            type:Datatypes.INTEGER
        },
        commentCount:
        {
            type:Datatypes.INTEGER
        }
        
    })
    return Post
}