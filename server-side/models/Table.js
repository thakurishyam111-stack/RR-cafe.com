
import mongoose from "mongoose";
const tableSchema = new mongoose.Schema(
    {

        tableNo: {
            type: Number,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["available", "occupied", "reserved", "cleaning"],
            default: "available"

        },
    },

    {
        timestamps: true,
    }

);
const Table = mongoose.model("Table", tableSchema)
export default Table;
