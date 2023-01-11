const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userId :{
            type: String
        },
        name:{
            type : String
        },
        address:{
            type : String
        },
        emailId:{
            type : String,
            unique:true
        },
        phoneNo:{
            type : Number
            
        },
        password :{
            type : String,
            required:true
            
        },
        userBookings:{
            type: Array
        }
    }
);

const userModel = mongoose.model('users',userSchema);

module.exports = userModel;