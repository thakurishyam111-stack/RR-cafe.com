import Table from "../models/Table.js";
import crypto from "crypto";

//get all table
export const getAllTable = async (req, res) => {
    try {
        const table = await Table.find();
        res.status(200).json({
            success: true,
            table,
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
//find the tabale by qr token 
 export const getTableQrToken = async (req, res) => {
    try {
        const table = await Table.findOne({ qrToken: req.params.qrToken });
        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found",
            });
        }
        res.status(200).json({
            success: true,
            table,
        });
    } catch (exception) {
        res.status(500).json({
            success: false,
            message: exception.message,
        });
    }
}
//get availebal table 

export const availableTable = async (req, res) => {
    try {
        const tables = await Table.find({
            status: "available",
        }).sort({ tableNo: 1 });



        res.status(200).json({
            success: true,
            total: tables.length,
            tables,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


//create table

export const createTable = async (req, res) => {
    try {
        // Ensure qrToken is generated server-side and unique
        if (!req.body.qrToken) {
            const providedNumber = req.body.tableNo;
            let token;
            let exists = null;
            do {
                const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
                const numberPart = providedNumber ? String(providedNumber).padStart(3, "0") : String(Math.floor(1 + Math.random() * 999)).padStart(3, "0");
                token = `TBL-${numberPart}-${rand}`;
                exists = await Table.findOne({ qrToken: token });
            } while (exists);

            req.body.qrToken = token;
        }

        const newtable = await Table.create(req.body);

        res.status(200).json({
            success: true,
            message: "table created successfully",
            table: newtable,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};


//update table status 

export const updateTable = async (req, res) => {
    try {
        const updatedtable = await Table.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updateTable) {
            return res.status(404).json({
                success: false,
                message: "table not found"

            });
        }

        res.status(200).json({
            success: true,
            message: "table status update succefully",
            table: updateTable,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

// delete table 

export const deleteTable = async (req, res) => {
    try {
        const deletedtable = await Table.findByIdAndDelete(req.params.id,);

        res.status(200).json({
            success: true,
            message: "table deleted successfully ",

        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


