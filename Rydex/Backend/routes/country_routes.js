import { Router } from "express";
import { createcountry, getallcountry } from "../controllers/countrycontroller.js";
const countryrouter = Router();

countryrouter.post('/' , createcountry)
countryrouter.get('/' , getallcountry)


export default countryrouter;
