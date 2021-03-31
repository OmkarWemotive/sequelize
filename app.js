const express= require('express')
const multer=require('multer')
const bodyParser = require('body-parser');
const app = express()
const auth= require('./middleware/auth')
// app.use(express.json()) 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = 4000
require('./models')

//----------------------------Upload Files middleware-------------------------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img')
    },
    filename: function (req, file, cb) {
        
        cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })


//--------------------------------------Load router--------------------------------

const userRouter=require('./controller/userController')
const postRouter=require('./controller/postController')

//--------------------------------------User Routs-----------------------------------

app.post('/save-user',userRouter.saveUser)
app.post('/login',userRouter.loginUser)
app.get('/show-profile',auth,userRouter.viewUser)
app.post('/search',userRouter.searchUser)
app.patch('/update',auth,userRouter.updateUser)
app.get('/logout',auth,userRouter.logoutUser)
app.get('/users',userRouter.allUser)

//--------------------------------------Friend Request Routs-----------------------------------

app.post('/send-request',auth,userRouter.sendRequest)
app.delete('/cancle-request',auth,userRouter.cancleRequest)
app.post('/request-status',auth,userRouter.requestStatus)
app.get('/my-request',auth,userRouter.myRequest)
app.get('/my-frinds',auth,userRouter.myFriends)

//--------------------------------------Post Routs-----------------------------------

app.post('/add-post',auth,upload.single('avatar'),postRouter.addPost)
app.get('/my-post',auth,postRouter.viewPost)
app.get('/view-all-post',auth,postRouter.viewAllPost)
app.post('/comment',auth,postRouter.commentPost)
app.post('/like',auth,postRouter.likePost)
app.post('/dislike',auth,postRouter.dislikePost)
app.get('/delete-post/:id',auth,postRouter.deletePost)
app.post('/view-comment',postRouter.viewPostComment)
app.post('/view-like',postRouter.viewPostLike)



app.listen(port,()=>{
    console.log('app is listening on ',port)
})

//post ->like cmntt count inc
//view signle post