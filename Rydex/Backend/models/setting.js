import mongoose from "mongoose";

const settingSchema = mongoose.Schema({
    seconds:{
        type:Number,
        required: true
    },
    stops:{
        type:Number,
        required: true
    }
})

const Setting = mongoose.model('Setting',settingSchema);
export default Setting;