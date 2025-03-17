import { Router } from "express";
import multer from "multer";
import { createuser, deleteuser, getuser, updateuser } from "../controllers/usercontroller.js";
import { addcard, getcustomercards, setdefaultcard } from "../controllers/cardcontroller.js";

const userrouter = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

userrouter.post('/', upload.single('profile'), createuser);
userrouter.get('/', getuser);
userrouter.put('/', upload.single('profile'), updateuser);
userrouter.delete('/delete', deleteuser);
userrouter.post('/addcard', addcard);
userrouter.get('/getcard/:id', getcustomercards);
userrouter.post('/setdefault', setdefaultcard);

export default userrouter;

