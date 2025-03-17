import vehicle from "../models/vehicle.js";


export const createvehicle = async (req, res) => {

    try {
        const vehicletype = req.body.vehicletype;
        const vehicleicon = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';
        
        const newVehicle = new vehicle({
            vehicletype,
            vehicleicon
        });
        const savedVehicle = await newVehicle.save();
        let user = await vehicle.find();
 
        res.json(user);

    } catch (error) {
        res.status(500).json({ error: 'Error saving vehicle' });
    }


};

export const getallvehicle = async(req,res) => {
    try {

        let allvehicle = await vehicle.find();        
        res.json(allvehicle);
        

    } catch (error) {
        res.status(500).json({ error: 'Error getting all vehicle' });
    }
}

export const Updatevehicle = async(req,res) => {
    try {
        const id = req.query.id;
        
        const vehicletype = req.body.vehicletype;
        const vehicleicon = req.file ? `/uploads/${req.file.filename}` : undefined;
        

        const updatedvehicle = await vehicle.findByIdAndUpdate(
            id,
            { vehicletype:vehicletype , vehicleicon:vehicleicon},
            { new: true }
        );

        res.json(updatedvehicle);
        
    } catch (error) {
        res.status(500).json({ error: 'Error updating vehicle' });
    }
 
}