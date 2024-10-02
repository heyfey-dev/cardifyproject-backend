const mongoose = require ('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        unique: true,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    phone:{
        type: String, 
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true,
        
    }

})

module.exports = mongoose.model('usermodel', userSchema)