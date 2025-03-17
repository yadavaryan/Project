import Credential from "../models/login.js"
import jwt from "jsonwebtoken"

const JWT_SECRET = 'private'
export const login = async(req,res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const user = await Credential.find({username:username,password:password})
        if(user.length){
        const token = jwt.sign({ username,password }, JWT_SECRET, { expiresIn: '24h' });
        return res.json(token);
        }else{
            return res.status(401).json({
                error: {
                  code: 401,
                  message: 'Invalid Username or Password',
                },
              });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error logging ' });
    }
}

export const isloggin = async(req,res) => {
    try {
        const token = req.query.token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await Credential.find({username:decoded.username,password:decoded.password})

        if(user.length){
            return res.status(200).json({isvalid: true}); 
        }else{
            return res.status(401).json({isvalid: false});
        }
    } catch (error) {
        res.status(401).json({error:'invalid token or expired'})
    }
}