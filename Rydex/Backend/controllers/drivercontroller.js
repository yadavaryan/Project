import Driver from "../models/driver.js";

export const createdriver = async(req,res) => {
    try {
        const profile = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const country = req.body.country;
        const city = req.body.city;
        const ischecked = true;
        
        const newdriver = new Driver({
            profile,
            name,
            email,
            phone,
            country,
            city,
            ischecked
        });
        const savedDriver = await newdriver.save();
        res.json(savedDriver);
    } catch (error) {
        res.status(500).json({ error: 'Error saving driver' });
    }
}

export const getdriver = async (req, res) => {

    try {
        const currentpage = req.query.currentpage;
        const search = req.query.searchquery || '';
        const sorting = req.query.sorting || 'name';
        const searchfilter = {
            $or: [
            { name: { $regex: search, $options: 'i' } },              
            { email: { $regex: search, $options: 'i' } },              
            { phone: {$regex: search, $options: 'i' } }               
          ]}
        const limit = 3;
        const skip = (currentpage - 1) * limit;
        const datalength = await Driver.find(searchfilter);
        const results = await Driver.aggregate([
             {
            $lookup: {
                from: "vehicletypes",
                localField: "servicetype",
                foreignField: "_id",
                as: "services",
              },
            },
            {
              $match: searchfilter
            },
            { $skip: skip },                                      
            { $limit: limit },
            {$sort: {[sorting]:1}}                                     
          ]);
          

              
        res.json({results,datalength});

    } catch (error) {
        res.status(500).json({ error: 'Error load user' });
    }


};

export const updatedriver = async (req, res) => {

    try {
        const id = req.query.id;
        const profile = req.file ? `/uploads/${req.file.filename}` : undefined ;
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const country = req.body.country;
        const city = req.body.city

        
        const updateddriver = await Driver.findByIdAndUpdate(
            id,
            {
                profile,
                name,
                email,
                phone,
                country,
                city
            },
            {new:true}
        )
    
        res.json(updateddriver);

    } catch (error) {
        res.status(500).json({ error: 'Error updating driver' });
    }


};

export const deletedriver = async (req,res) => {
    try {
        const id = req.query.id;
        await Driver.deleteOne({_id:id});
        res.json('deleted succesfully');
    } catch (error) {
       res.status(500).json({ error: 'Error deleting driver' });
    }
}

export const driverstatus = async (req,res) => {
    try {
        const id = req.query.id;
        const data =  req.body.status
        
        const updatestatus = await Driver.findByIdAndUpdate(
            id,
            {
              ischecked:data
            },
            {new:true}
        )
    
        res.json(updatestatus);
        
    } catch (error) {
       res.status(500).json({ error: 'Error updating status' });
    }
}

export const addservice = async (req,res) => {
    try {
        const serviceid = req.body.serviceid;
        const driverid =  req.body.driverid

        const updateservice = await Driver.findByIdAndUpdate(
            driverid,
            {
              servicetype:serviceid
            },
            {new:true}
        )
    
        res.json(updateservice);
        
    } catch (error) {
       res.status(500).json({ error: 'Error updating service' });
    }
}