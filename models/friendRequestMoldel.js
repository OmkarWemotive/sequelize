
module.exports=(sequelize,Datatypes)=>{

    const FriendRequest=sequelize.define('frindrequest',{
        sender_id:
        {
            type:Datatypes.INTEGER
        },
        receiver_id:
        {
            type:Datatypes.INTEGER
        }
        ,
        status:
        {
            type:Datatypes.INTEGER,
            defaultValue:0
        }
        
    })
    return FriendRequest
}