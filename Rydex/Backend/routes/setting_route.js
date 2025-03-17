import { Router } from "express";
import { getsetting, savesetting } from "../controllers/settingcontroller.js";

const settingrouter = Router();

settingrouter.post('/',savesetting);
settingrouter.get('/',getsetting);


export default settingrouter;