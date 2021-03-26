
module.exports=(sequelize,Datatypes)=>{

    const Comment=sequelize.define('comment',{
        comment:
        {
            type:Datatypes.STRING,
            allowNull: false
        },
        post_id:
        {
            type:Datatypes.INTEGER
        }
        ,
        user_id:
        {
            type:Datatypes.INTEGER
        }
        
    })
    return Comment
}