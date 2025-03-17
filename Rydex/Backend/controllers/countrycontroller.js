import Country from "../models/country.js";

export const createcountry = async (req,res) => {
  
    try {
        const countryname = req.body.countryname;
        const currency = req.body.currency;
        const countrycode = req.body.countryCode;
        const callingcode = req.body.callingCode;
        const flags = req.body.flag;
        const timezone = req.body.timezone;
        
        
        const newcountry = new Country({
            countryname,
            currency,
            countrycode,
            callingcode,
            flags,
            timezone
        });
        
        const savedcountry = await newcountry.save();
        let country = await Country.find();
        res.json(country);

    } catch (error) {
        res.status(500).json({ error: 'Error saving country' });
    }
}

export const getallcountry = async(req,res) => {
    try {

        let allcountry = await Country.find();        
        res.json(allcountry);

    } catch (error) {
        res.status(500).json({ error: 'Error getting all country' });
    }
}