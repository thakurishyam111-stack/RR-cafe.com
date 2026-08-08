
import express from "express";
import { availableTable, 
    createTable, 
    deleteTable,
     getAllTable,
      getTableQrToken, 
      updateTable
     } from "../controllers/tableController.js";


const route = express.Router();

route.get('/', getAllTable);
route.post("/add", createTable);
route.get('/qr/:qrToken',getTableQrToken);
route.get("/available", availableTable);

route.put("/:id", updateTable);

route.delete("/:id", deleteTable);





export default route;