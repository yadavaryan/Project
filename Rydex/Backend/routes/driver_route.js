import { Router } from "express";
import multer from "multer";
import { addservice, createdriver, deletedriver, driverstatus, getdriver, updatedriver } from "../controllers/drivercontroller.js";

const driverrouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

driverrouter.post('/', upload.single('profile'), createdriver);
driverrouter.put('/', upload.single('profile'), updatedriver);
driverrouter.get('/', getdriver);
driverrouter.delete('/', deletedriver);
driverrouter.post('/status', driverstatus);
driverrouter.post('/service', addservice);


export default driverrouter;