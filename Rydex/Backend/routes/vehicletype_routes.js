import { Router } from 'express';
import multer from 'multer';
import { createvehicle, getallvehicle, Updatevehicle } from '../controllers/vehicletypeController.js';
const vehiclerouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

vehiclerouter.post('/', upload.single('vehicleicon'), createvehicle);
vehiclerouter.get('/get',getallvehicle)
vehiclerouter.put('/', upload.single('vehicleicon'),Updatevehicle)


export default vehiclerouter;

