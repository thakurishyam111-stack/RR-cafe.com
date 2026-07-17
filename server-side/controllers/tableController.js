// import Table from "../models/Table";
import Table from "../models/Table.js";

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

//get availebal table 

export const availableTable = async (req, res) => {
    try {
        const tables = await Table.find({
            status: "available",
        }).sort({ tableNo: 1 });

        res.status(200).json({
            success: true,
            total: table.length,
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
        const updatedtable = await Table.findByIdAndUpdate(req.params.id, req.body,  {
            new: true,
            runValidators: true,
        });
        if (!table) {
            return res.status(404).json({
                success: false,
                message: "table not found"

            });
        }

        res.status(200).json({
            success: true,
            message: "table status update succefully",
            table: table,
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


