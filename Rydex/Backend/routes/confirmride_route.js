import { Router } from "express";
import { driverlist, loadrides, ridehistory } from "../controllers/confirmridecontroller.js";
import { assigndriver, assignrandomdriver, deleteride, loadspecificride, randomreassign } from "../controllers/runningreqcontroller.js";


const confirmriderouter = Router();

confirmriderouter.get('/',loadrides)
confirmriderouter.get('/driver',driverlist)
confirmriderouter.get('/running',loadspecificride)
confirmriderouter.post('/',assigndriver)
confirmriderouter.post('/random',assignrandomdriver)
confirmriderouter.put('/',deleteride)
confirmriderouter.put('/onreject',randomreassign)
confirmriderouter.get('/ridehistory',ridehistory)

export default confirmriderouter