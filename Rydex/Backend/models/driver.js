import mongoose from "mongoose";

const driverschema = mongoose.Schema({
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
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    servicetype:{
        type:mongoose.Schema.Types.ObjectId,
    },
    ischecked:{
        type:Boolean
    }
    ,
    currentreq:{
        type:Boolean,
        default:false
    }        
})

const Driver = mongoose.model('Driver',driverschema);
export default Driver