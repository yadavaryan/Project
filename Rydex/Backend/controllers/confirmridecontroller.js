    import mongoose from "mongoose";
    import CREATERIDE from "../models/createride.js";
    import Driver from "../models/driver.js";

    export const loadrides = async (req, res) => {
        try {
        const selectedvehicletype = req.query.selectedvehicletype.toString().trim();
        const search = req.query.searchquery || "";
        const selectedstatus = req.query.selectedstatus;
        const searchfilter = {
        $or: [
            { 'user.name': { $regex: search, $options: "i" } },
            { 'user.phone' : { $regex: search, $options: "i" } },
        ],
        };
        const aggregatepipline = [
        
        {
            $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "users",
            },
        },
        {
            $lookup: {
            from: "vehicletypes",
            localField: "selectedvehicle",
            foreignField: "_id",
            as: "vehicle",
            },
        },
        {
            $lookup: {
            from: "drivers",
            localField: "driver",
            foreignField: "_id",
            as: "driver",
            },
        },
        {
        $match: {
            $and:[
                selectedvehicletype 
                ? { selectedvehicle: new mongoose.Types.ObjectId(selectedvehicletype) } 
                : {},
                selectedstatus 
                ? { status: selectedstatus } 
                : {}
            ]
            }
        },
        {
            $match: {
                status: { $in: ['Assigned', 'Accepted', 'Arrived', 'Picked', 'Started','No-Driver-Available','Pending'] }
            }
        }
        
        ];
        const rides = await CREATERIDE.aggregate(aggregatepipline);


        res.json(rides);

    } catch (error) {
        res.status(500).json({ error: "Error finding rides" });
    }
    };

    export const driverlist = async(req,res) => {
        try {
            const vehicle = req.query.vehicle;

            const driver = await Driver.find({servicetype:vehicle})

            res.json(driver)
        } catch (error) {
            res.status(500).json({ error: "Error finding driver" });
        }
    }

    export const ridehistory = async (req,res) => {
        try {
            const rides = await CREATERIDE.aggregate([
                
                    {
                        $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "users",
                        },
                    },
                    {
                        $lookup: {
                        from: "vehicletypes",
                        localField: "selectedvehicle",
                        foreignField: "_id",
                        as: "vehicle",
                        },
                    },
                    {
                        $match: {
                            status: { $in: ['Completed', 'Cancel'] }
                        }
                    }
                
            ])
            
            res.json(rides)
        } catch (error) {
            res.status(500).json({ error: "Error finding ride-history" });
        }
    }
