import mongoose from "mongoose";
import { Schema } from "mongoose";

const userschema = mongoose.Schema({
    profile: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    country: {
        type:Schema.Types.ObjectId,
        required: true
    },
    stripeCustomerid:{
        type:String,
        required: true
    }      
})

const User = mongoose.model('User',userschema);
export default User