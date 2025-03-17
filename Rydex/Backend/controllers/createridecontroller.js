import CREATERIDE from "../models/createride.js";
import User from "../models/user.js";


export const verifyuser = async(req,res) => {
  
    try {
        const number = req.body.data;
    
        const user = await User.aggregate([
            {
                $lookup: {
                    from: "countries",
                    localField: "country",
                    foreignField: "_id",
                    as: "country",
                  },
                },
            {$match: {phone:number}},
          ]);

          
        const data = {
            name:user[0].name,
            email:user[0].email,
            userId:user[0]._id,
            country:user[0].country[0].countrycode
        }
        res.json(data)

    } catch (error) {
        res.status(500).json({ error: 'Error finding user' });
    }

  
}

export const saveride = async(req,res) => {

    try {
        const {user,pickup,drop,stop,selectedvehicle,paymentMethod,bookingType,distance,duration,fare,scheduleAt} = req.body;

        const newride = new CREATERIDE({
            user,
            pickup,
            drop,
            stop,
            selectedvehicle,
            paymentMethod,
            bookingType,
            distance,
            duration,
            fare,
            scheduleAt
        })

        const savedride = newride.save();
        res.json(savedride)

    } catch (error) {
        res.status(500).json({ error: 'Error Booking ride' });
    }
}