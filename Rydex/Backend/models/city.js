import mongoose from "mongoose";

const polygonSchema = {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]],
      required: true
    }
  };

const citySchema = new mongoose.Schema({
    country:{
        type:String
    },
    city:{
        type:String
    },
    geometry:polygonSchema

});




  const City = new mongoose.model('City',citySchema);
  export default City;
  