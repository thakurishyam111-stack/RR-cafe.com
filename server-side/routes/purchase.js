import express from "express";
import {
    addPurchase,
    deletePurchase,
    getPurchase,
    singlePurchae,
    updatePurchase
} from "../controllers/purchaseController.js";

const route = express.Router();

//get all purchase 
route.get("/", getPurchase);

//get single purchase 

route.get("/:id", singlePurchae);

//add purchae 

route.post("/add", addPurchase);

//update purchase 

route.put("/:id", updatePurchase);

//delete purchase

route.delete("/:id", deletePurchase);

export default route;