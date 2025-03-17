import { Router } from "express";
import { isloggin, login } from "../controllers/logincontroller.js";

const loginrouter = Router();

loginrouter.post('/',login);
loginrouter.get('/',isloggin);


export default loginrouter; 