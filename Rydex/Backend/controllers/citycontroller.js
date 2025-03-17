import City from "../models/city.js";

export const savepolygone = async (req, res) => {

    try {
        const country = req.body.country;
        const city = req.body.city;
        const coordinates = req.body.coordinates;

        const newcity = new City({
            country,
            city,
            geometry: {
                type: "Polygon",
                coordinates: [coordinates],
            },
        })

        const savedcity = await newcity.save();
        res.json(savedcity);

    } catch (error) {
        res.status(500).json({ error: 'Error saving polygone' });
    }
}

export const getpolygon = async (req, res) => {
    try {
        const city = req.query.city;
        const data = await City.find({ "city": city });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error saving polygone' });
    }
}

export const allcity = async (req, res) => {
    try {
        const allcities = await City.find({}, { 'city': 1, '_id': 0 })
        res.json(allcities);
    } catch (error) {
        res.status(500).json({ error: 'Error sending allcity' });
    }
}

export const updatepolygone = async (req, res) => {
    try {
        const city = req.query.city
        const coordinates = req.body
        
        const data = await City.findOneAndUpdate(
            { city: city },
            { $set: { 'geometry.coordinates': coordinates } },
            { new: true }
        );
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating polygone' });

    }
}