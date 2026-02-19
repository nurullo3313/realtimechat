import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email :{
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required :true,
        minleangth :6,
    },
    profilImage : {
        type : String,
        default :""
    },
    bio  : {
         type : String,
        default : "" 
    }
} ,
{timestamps : true}
)

export default mongoose.model("users", userSchema)