import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  bookingType: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    required: true,
  },
  drop: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  fare: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  pickup: {
    type: String,
    required: true,
  },
  scheduleAt: {
    type: Date, 
  },
  selectedvehicle: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  stop: [
    {
      type: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  driver: {
    type: Schema.Types.ObjectId,
  },
  status: {
    type: String,
    default: 'Pending'
  },
  assignoption: {
    type: String,
    default: ''
  },
  assignAt: {
    type: Date
  },
  previousdrivers: {
    type: Array,
    default: null
  }

});

const CREATERIDE = model("CREATERIDE", bookingSchema);

export default CREATERIDE;
