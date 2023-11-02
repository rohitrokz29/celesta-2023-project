/**
 * Importing required modules
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');
const mongoose=require('mongoose');

//Express App creation
const app = express();

//configuring environmental variables and secret keys
require('dotenv').config();

//importing routers
const userRouter=require('./routes/user.router');

//using middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_ENCRYPT_SECRET.toString()));
app.use(cookieEncrypter(process.env.COOKIE_ENCRYPT_SECRET.toString()));

/**
 * User router contains all user related routes
 */
app.use('/user',userRouter);

//connecting database
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'celesta2023',
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to DB")
})
.catch(err=>console.log(err.message))

// starting the server
app.listen(process.env.PORT, () => {
  console.log(`a\listening at http://localhost:${process.env.PORT}`);
});