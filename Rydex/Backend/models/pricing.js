import mongoose from "mongoose";

const pricingschema = mongoose.Schema({

    country:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    type:{
        type:mongoose.Schema.Types.ObjectId,
        required: true
    },
    driverProfit:{
        type:String,
        required: true
    },
    minFare:{
        type:String,
        required: true
    },
    baseDistance:{
        type:String,
        required: true
    },
    basePrice:{
        type:String,
        required: true
    },
    pricePerUnitDistance:{
        type:String,
        required: true
    },
    pricePerUnitTime:{
        type:String,
        required: true
    },
    maxSpace:{
        type:String,
        required: true
    },
    
});

const Pricing = mongoose.model('Pricing',pricingschema);
export default Pricing