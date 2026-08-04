import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema(
    {
        stock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        unit: {
            type: String,
            enum:['kg','gm','ltr','ml','pcs'],
            required: true,
        },

        purchasePrice: {
            type: Number,
            required: true,
            min: 0,
        },

        total: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const purchaseSchema = new mongoose.Schema(
    {
        purchaseNumber: {
            type: String,
            unique: true,
            required: true,
        },

        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },

        purchaseDate: {
            type: Date,
            default: Date.now,
        },

        items: {
            type: [purchaseItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "At least one item is required.",
            },
        },

        subTotal: {
            type: Number,
            required: true,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
        },

        grandTotal: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "Online", "Credit"],
            default: "Cash",
        },

        paymentStatus: {
            type: String,
            enum: ["Paid", "Partial", "Due"],
            default: "Paid",
        },

        paidAmount: {
            type: Number,
            default: 0,
        },

        dueAmount: {
            type: Number,
            default: 0,
        },

        note: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;