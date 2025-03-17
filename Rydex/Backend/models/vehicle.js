import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicletype: {
        type: String,
        required: true,
    },
    vehicleicon: {
        type: String,
    }   
});

const vehicle = mongoose.model('vehicletype',vehicleSchema);
export default vehicle;