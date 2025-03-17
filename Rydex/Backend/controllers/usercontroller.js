import User from "../models/user.js";

import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QhUo74FHz8fCvAZ97seXgUedsgiV8A7ASzxFzY57XKj4TnKjrnw9sVteGCNxe3XTXoXuIG9Y3FFacIGKP0wqwFz00ZqQgm2Ra');

export const createuser = async (req, res) => {

    try {

        const customer = await stripe.customers.create({
            name: req.body.name,         
            email: req.body.email,      
        });


        const profile = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const country = req.body.country;
        const stripeCustomerid = customer.id;
        
        const newUser = new User({
            profile,
            name,
            email,
            phone,
            country,
            stripeCustomerid
        });
        const savedUser = await newUser.save();
        res.json(savedUser);

    } catch (error) {
        res.status(500).json({ error: 'Error saving user' });
    }


};

export const getuser = async (req, res) => {

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
        const datalength = await User.find(searchfilter);
        const results = await User.aggregate([
            {
                $lookup: {
                    from: "countries",
                    localField: "country",
                    foreignField: "_id",
                    as: "country",
                },
                },
            {
            $match: searchfilter},

            { $skip: skip },

            { $limit: limit },

            {$sort: {[sorting]:1}}                                     
        ]);  

        res.json({results,datalength});

    } catch (error) {
        res.status(500).json({ error: 'Error load user' });
    }


};

export const updateuser = async (req, res) => {

    try {
        const id = req.query.id;
        const profile = req.file ? `/uploads/${req.file.filename}` : undefined ;
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const country = req.body.country;
        
        const updateduser = await User.findByIdAndUpdate(
            id,
            {
                profile,
                name,
                email,
                phone,
                country
            },
            {new:true}
        )
    
        res.json(updateduser);

    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }


};

export const deleteuser = async (req,res) => {
    try {
        const id = req.query.id;
        await User.deleteOne({_id:id});
        res.json('deleted succesfully');
    } catch (error) {
       res.status(500).json({ error: 'Error deleting user' });
    }
}