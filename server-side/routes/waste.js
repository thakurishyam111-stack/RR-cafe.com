import express from "express"
import { createwaste, 
    deletewaste,
     getSinglewaste,
      getwaste, 
      updatewaste 
    } from "../controllers/wasteController.js";

const route = express.Router();

// get all waste
route.get("/",getwaste);
 
//get single waste 

route.get("/:id",getSinglewaste);

// add waste item
route.post("/add",createwaste);

//update waste items
route.put("/:id", updatewaste);

// delete waste items 
route.delete("/:id",deletewaste);

export default route;