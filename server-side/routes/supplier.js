import express from "express";
import { createsuppliers, 
    deletesuppliers,
     getsupplier, 
     singlesupplier,
      updatesupplier 
    } from "../controllers/supplierController.js";



const route =express.Router();

route.get("/", getsupplier);

route.get("/:id", singlesupplier);

route.put("/:id", updatesupplier);

route.post("/add", createsuppliers);

route.delete("/:id", deletesuppliers);

export default route;