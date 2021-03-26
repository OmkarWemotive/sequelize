
module.exports=(sequelize,Datatypes)=>{

    const Like=sequelize.define('like',{
        like:
        {
            type:Datatypes.BOOLEAN,
            defaultValue: 1
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
    return Like
}