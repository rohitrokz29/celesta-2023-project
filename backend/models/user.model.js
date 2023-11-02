/**
 * User Model Exists here
 */

const mongoose = require('mongoose');

//validator to check user details are valid or not
const validator = require("validator");

//bcryptjs for password hashing
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true,},
    password: { type: String, required: true },
    user: {
        name: { type: String },
        gender: { type: String },
        age:{type:Number,required:true}
    },
    //history to store previous records
    history:{
        type:[
            {
                date: { type: String, default:`${ new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`, immutable: true },
                title:{type:String},
                description:{type:String}
            }
        ]
    }

});

/**
 * SignUp USer CREATEING USER
 */
userSchema.statics.createUser=async function createUser({name, email,password,gender,age}){
    try {
        if(!name || !age||!gender ||!password|| !email){
            throw new Error("Inconplete data",{statusCode:406});
        }
        if (!validator.isEmail(email)) {
            throw new Error("Invalid Email", { statusCode: 406 });
        }

          //checking if email  already exist
        var check = await this.findOne({ email: email });
        if (check) {
            throw new Error("Email Already Exist", { statusCode: 302 })
        }
      
        if (!validator.isStrongPassword(password)) {
            throw new  Error("Password Not Strong", { statusCode: 406 });
        }
        //storing password
        console.log({name,email,age})
        const salt = bcryptjs.genSaltSync(12);
        const hashPassword = bcryptjs.hashSync(password, salt);
        
        //crreating user
        const newUser = new this({ email, password: hashPassword, user: {  email,gender,age } });
        newUser.save();

        return { name: newUser.name, _id: newUser._id };

    } catch (error) {
        throw new Error(error.message) ;
    }
}

/**
 * Signin user
 */
userSchema.statics.signin = async function signin({ email, password }) {
    //Email Validation
    if (!validator.isEmail(email)) {
        throw new Error("Invalid Email", { statusCode: 406 });
    }
    try {
        //finging user
        const user = await this.findOne({ email: email }).select('_id password user.name');
        if (!user) {
            //user doesnot exist 
            throw new Error("User doesn't Exist", { statusCode: 404 });
        }
        if (!bcryptjs.compareSync(password, user.password)) {
            //passwords doesnot matched
            throw new Error("Incorrect Password", { statusCode: 406 });
        }
        return { name:user.user.name, _id: user._id };
    } catch (error) {
        throw new Error(error.message, { statusCode: 500 });
    }

}
/**
 * Find User data
 */
/* findUser function for finding user from DB */
userSchema.statics.getUserDetails = async function getUserDetails({ email }) {
    try {
        return this
            .findOne({ email }, { _id: 0, password: 0, email: 0, __v: 0, "history._id":0 })
            .exec()

    } catch (error) {
        throw new Error("User Not Found", { StatusCode: 404 });
    }
}

userSchema.statics.addHistory=async function addHistory({_id,description,title}){
    try {
        
        let newItem={title,description};
        const result = await this.updateOne({ _id }, {
            $push: {
                history: { $each: [newItem], $position: 0 }
            }
        }, { new: true })
            .lean()
            .exec()
        if(!result) return null;
        return result;
    } catch (error) {
        return null;
    }
}



module.exports = mongoose.model('user', userSchema);