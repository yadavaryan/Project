import mongoose from "mongoose";

const loginSchema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
})

const Credential = mongoose.model('Credential',loginSchema);
export default Credential;