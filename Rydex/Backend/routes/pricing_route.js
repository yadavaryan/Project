import { Router } from "express";
import { getallpricing, savepricing, updateprice } from "../controllers/pricingcontroller.js";

const pricingrouter = Router();

pricingrouter.post('/',savepricing);
pricingrouter.get('/',getallpricing);
pricingrouter.put('/',updateprice);


export default pricingrouter;