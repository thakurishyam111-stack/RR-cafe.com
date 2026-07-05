import mongoose from "mongoose";

const wasteSchema = new mongoose.Schema(
    {

        stock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
            required: true,
        },

        wasteName: {
            type: String,
            required: true,
        },

        unit: {
            type: String,
            required: true,
        },

        quantity: {
            type: String,
            required: true,
            min: 1,
        },

        reason: {
            type: String,
            required: true,
            enum: [
                "Expired",
                "Damaged",
                "spolide",
                "Burnt",
                "Customer Return",
                "preparation Mistake",
                "others",
            ],
        },
        cost: {
            type: Number,
            required: true,
        },

        note: {
            type: String,
            default: "",
        },

       
    },

    {
        timestamps: true,
    }
);

const Waste = mongoose.models.Waste || mongoose.model("Waste", wasteSchema);

export default Waste;