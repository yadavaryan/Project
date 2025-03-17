import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    countryname: {
        type: String,
    },
    currency: {
        type: String,
    },
    countrycode: {
        type: String,
    },
    callingcode: {
        type: String,
    },
    flags: {
        type: String,
    },
    timezone: {
        type: String,
    },   
      
});

const Country = mongoose.model('Country',countrySchema);
export default Country;