import { httpServer, io } from "../app.js";
import CREATERIDE from "../models/createride.js";
import Driver from "../models/driver.js";
import cron from "node-cron"

export const assigndriver = async(req,res) => {
    try {

        const d_id = req.body.driver;
        const r_id = req.body.ride;
        const currenttime = Date.now()

        const ride = await CREATERIDE.findOneAndUpdate({_id:r_id},{$set:{driver:d_id,status:'Assigned',assignoption:'selected',assignAt:currenttime}});
        const driver = await Driver.find({_id:d_id})

        io.emit("ride",ride)
        res.json(driver)

    } catch (error) {
        res.status(500).json({ error: "Error assign driver" });
    }
}

export const assignrandomdriver = async(req,res) => {
    try {
        const r_id = req.body.ride;
        const s_id = req.body.service
        
        const driver = await Driver.findOne({
            ischecked:true,
            $or: [ { currentreq: { $exists: false } }, { currentreq: false } ],
            servicetype:s_id
        })
        if(driver){
        const d_id = driver._id
        const currenttime = Date.now()
        const ride = await CREATERIDE.findOneAndUpdate(
            {_id:r_id},
            {$set: {driver:d_id,status:'Assigned',assignoption:'random',assignAt:currenttime},
            $push: {previousdrivers: d_id} }
        )
        const currenttrue = await Driver.findOneAndUpdate({_id:d_id},{$set:{currentreq:true}})
        io.emit("ride",ride)
        res.json(driver)
    }else{
        const ride = await CREATERIDE.findOneAndUpdate({_id:r_id},{$set:{status:"Not-available"}})
        io.emit("ride",ride)
        res.json(ride)
    }
        

    } catch (error) {
        res.status(500).json({ error: "Error assign driver" });
    }
}

export const loadspecificride = async(req,res) => {
    try {
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
                        $match: {
                            $and:[
                            {status: { $in: ['Assigned', 'Accepted', 'Arrived', 'Picked', 'Started'] }},
                            {status: {$ne:'Completed'}}
                            ]
                        }
                    }
                ]

        const ride = await CREATERIDE.aggregate(aggregatepipline)
        const payload = JSON.stringify({
            title: 'Driver is not available!',
            body: 'Driver is not available!',
            icon: '/path-to-icon.png',
        });
        webPush
        .sendNotification(subscription, payload)
        .then(() => res.status(200).send('Notification sent successfully.') )
        .catch((err) => {
            console.error('Error sending notification:', err);
            res.status(500).send('Error sending notification.');
        });
        res.json(ride)

    } catch (error) {
        res.status(500).json({ error: "Error finding rides" });
    }
}

export const statuschange = async (data) => {
    try {
        const id = data.rideId;
        const status = data.status;

        const ride = await CREATERIDE.findOneAndUpdate({_id:id},{$set:{status:status}});

    } catch (error) {
        console.log('error');
    }
}

export const deleteride = async (req,res) => {
    try {
        const r_id = req.body.data
        const ride = await CREATERIDE.updateOne({_id:r_id},{$set:{status:'Pending',assignoption:'random',driver:null}})
        io.emit("ride",ride)
        res.json('updated')

    } catch (error) {
        res.status(500).json({ error: "Error finding rides" });
    }
}

export const randomreassign = async (req,res) => {
    try {
        const r_id = req.body.data
        await oneveryreassign(r_id)
    } catch (error) {
        res.status(500).json({ error: "Error reassign driver" });
    }
}


cron.schedule("*/1 * * * * *", async function() {

    const currentTime = Date.now()

    const timeoutrides = await CREATERIDE.find({
        status:  { $in: ['Assigned', 'onHold'] },
        assignAt: { $lte: new Date(currentTime - 30 * 1000) }
    })
    
    for(let ride of timeoutrides){
        await oneveryreassign(ride._id);
    }
});


export const oneveryreassign = async (rideId) => {
    const ride = await CREATERIDE.findOne({_id:rideId,assignoption:"random"})

        const pastdriver = ride.driver
        await Driver.updateOne({_id:pastdriver},{$set:{currentreq:false}})

        const availabledriver = await Driver.findOneAndUpdate(
            {ischecked:true , $or: [ { currentreq: { $exists: false } }, { currentreq: false } ], servicetype: ride.selectedvehicle._id,  _id: { $nin: ride.previousdrivers }},
            {$set:{currentreq:true}},
            {new:true}
        );
        const alldriver = await Driver.find({servicetype: ride.selectedvehicle._id});

        if(!availabledriver){


            if( ride.previousdrivers.length < alldriver.length){
            const onholdride = await CREATERIDE.updateOne(
                {_id:rideId},
                {$set:{status:'onHold',driver:null}}
            )
            io.emit("ride",onholdride)
            }else{
                const nodriver = await CREATERIDE.updateOne(
                    {_id:rideId},
                    {$set:{status:'No-Driver-Available',driver:null,previousdrivers:null}}
            )
            io.emit("ride",nodriver)
            

        }

        }else{

            const assignnewdriver = await CREATERIDE.updateOne(
                {_id:rideId},
                {$set:{driver:availabledriver._id,assignAt: new Date(),status:'Assigned'},
                $push: {previousdrivers: availabledriver._id}    
            },
            )
            io.emit("ride",assignnewdriver)
            
        }
    
    


}