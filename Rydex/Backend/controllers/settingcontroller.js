import Setting from "../models/setting.js";

export const savesetting = async (req,res) => {
    try {
        const seconds =req.body.seconds;
        const stops = req.body.stops;

        const newsetting = new Setting({
           seconds,
           stops
        })
        await Setting.deleteMany();
        const savedsetting = await newsetting.save();
        res.json(savedsetting);
        
    } catch (error) {
        res.status(500).json({ error: 'Error Saving Setting' });
    }
}

export const getsetting = async (req,res) => {
    try {
        const data = await Setting.find();
        res.json(data);
        
    } catch (error) {
        res.status(500).json({ error: 'Error getting' });
    }
}