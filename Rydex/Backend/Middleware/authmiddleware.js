import Credential from "../models/login.js";
import jwt from "jsonwebtoken"

const JWT_SECRET = 'private'
export const authmiddleware = async(req,res,next) => {
    const header = req.headers.authorization
    if (!header) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Credential.find({username:decoded.username,password:decoded.password})
        if(user.length){
            next(); 
        }else{
            return res.status(401).json({
                error: {
                  code: 401,
                  message: 'Invalid or expired token',
                },
              });
        }
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}