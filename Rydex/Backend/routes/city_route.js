import { Router } from "express";
import { allcity, getpolygon, savepolygone, updatepolygone } from "../controllers/citycontroller.js";

const cityrouter = Router();

cityrouter.post('/',savepolygone);
cityrouter.get('/',getpolygon);
cityrouter.get('/allcity',allcity)
cityrouter.put('/update',updatepolygone);


export default cityrouter;