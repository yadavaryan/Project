import Pricing from "../models/pricing.js";

export const savepricing = async (req,res) => {
    try {
        
       const {country,city,type,maxSpace,minFare,pricePerUnitTime,pricePerUnitDistance,basePrice,baseDistance,driverProfit} = req.body;

       const newpricing = new Pricing({
        country,
        city,
        type,
        minFare,
        maxSpace,
        pricePerUnitTime,
        pricePerUnitDistance,
        basePrice,
        baseDistance,
        baseDistance,
        driverProfit
       })

       const savedpricing = await newpricing.save();
       res.json(savedpricing)

    } catch (error) {
        res.status(500).json({ error: 'Error setting price' });
    }
}

export const getallpricing = async (req,res) => {
    try {
        const data = await Pricing.aggregate([
            {
                $lookup: {
                  from: "vehicletypes",
                  localField: "type",
                  foreignField: "_id",
                  as: "vehicletype",
                },
              },
              {
                $project: {
                  _id: 1, 
                  baseDistance: 1,
                  basePrice: 1,
                  city: 1,
                  country: 1,
                  driverProfit: 1,
                  maxSpace: 1,
                  minFare: 1,
                  pricePerUnitDistance: 1,
                  pricePerUnitTime: 1,
                  type: 1,
                  vehicletype: 1,
                },
              },
            ]);
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching price'});
    }
}

export const updateprice = async (req,res) => {
    try {
        const {maxSpace,minFare,pricePerUnitTime,pricePerUnitDistance,basePrice,baseDistance,driverProfit} = req.body;
        const id = req.query.id;
       
        const updatedpricing = await Pricing.findByIdAndUpdate(
            id,
            { 
                minFare,
                maxSpace,
                pricePerUnitTime,
                pricePerUnitDistance,
                basePrice,
                baseDistance,
                baseDistance,
                driverProfit
               },
            { new: true }
        );

        res.json(updatedpricing)
    } catch (error) {
        res.status(500).json({ error: 'Error updating price'});
    }
}