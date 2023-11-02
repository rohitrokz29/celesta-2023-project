//creating router
const userRouter=require('express').Router();

//Importing the controller functions
const { SignUp, 
        SignIn,
        LogOut,
        AddPreviousRecords,
        GetUSer } = require('../controllers/user.controller');

// Importing MiddleWares
const {userAuth}=require('../middlewares/user.auth');


//User routes

userRouter.post('/signup',SignUp);

userRouter.post('/signin',SignIn);

userRouter.post('/logout',LogOut);

userRouter.post('/record',userAuth,AddPreviousRecords);

userRouter.get('/:email',userAuth,GetUSer)

//exporting router
module.exports=userRouter;