import { Router } from "express";
import { saveride, verifyuser } from "../controllers/createridecontroller.js";

const createriderouter = Router();

createriderouter.post('/verify',verifyuser)
createriderouter.post('/',saveride)

export default createriderouter;