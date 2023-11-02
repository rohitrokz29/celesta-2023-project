const User=require('../models/user.model');
const CreateAccessToken = require('./token/createTokens');


const cookieOptions = {
    httpOnly: true,
    secure:true,
    sameSite:"strict",
    secure: process.env.NODE_ENV === 'production',
    expires:new Date(Date.now()+24*3600*1000)
};

//User Signup controller
const SignUp= async (req,res)=>{
    try {
        const {body}=req;
        const newUser=await User.createUser(body);
        const accessToken=await CreateAccessToken(newUser._id); 
        const authTokenExpiry=Date.now()+24 * 60 * 60 * 1000;

        res
        .cookie("accessToken",  accessToken, cookieOptions)
        .status(201)
        .json({ newUser: newUser.name, _id: newUser._id ,authTokenExpiry});

    } catch (error) {
        res.status(400).json({error:error.message});
    }
}

const SignIn= async (req,res)=>{
    try {
        //*below User.signin function exists in user model
        const user = await User.signin(req.body);

        const accessToken = CreateAccessToken(user._id);
        const authTokenExpiry=Date.now()+ 24 * 60 * 60 * 1000;

        //*sending auth token in the cookies
        console.log({accessToken})
          res
            .cookie('accessToken', accessToken, cookieOptions)
            .status(201)
            .json({ username: user.name, _id: user._id ,authTokenExpiry});
    }
    catch (error) {
        res.status(401).json({ message:error.message});
    }
}
const LogOut=async  (req,res)=>{
    try {

            //* clearing tokens in cookies
         res
            .clearCookie('accessToken',cookieOptions)
            .status(200)
            .json({ message: "Successfully Logged Out" })
        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

const AddPreviousRecords=async (req,res)=>{
    try {
        const {title,description}=req.body;
        if(description.length<100){
            throw new Error("Please Add more words ");
        }
        let result=await User.addHistory({title,description,_id:req._id});
        if(result ===null) throw Error("Record Addition Unsuccessful");
        res.status(200).json({message:"Record Added Successfully"});
    } catch (error) {
        res.status(404).json(error.message);
    }
}

const GetUSer=async (req,res)=>{
    try {
        let result=await User.getUserDetails(req.params);
        if(!result) throw Error();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message:"User Not Found"});
    }
}
module.exports={
    SignUp,
    SignIn,
    LogOut,
    AddPreviousRecords,
    GetUSer
}