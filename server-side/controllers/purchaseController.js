import Purchase from "../models/Purchase.js";
import Stock from "../models/Stock.js"

//get all purchase 

export const getPurchase = async (req, res) => {
    try {
        const purchase = await Purchase.find();
        return res.status(200).json({
            success: true,
            purchase,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//get single purchase 
export const singlePurchae = async (req, res) => {
    try {
        const purchaseitem = await Purchase.findById(req.params.id);

        if (!purchaseitem) {
            return res.status(404).json({
                success: false,
                message: "purchase items not found ",
            });
        }

        return res.status(200).json({
            success: true,
            Purchase: purchaseitem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//add purchase items 

export const addPurchase = async (req, res) => {
    try {
        // Purchase Save
        const purchase = await Purchase.create(req.body);

        // Stock Increase
        for (const item of purchase.items) {
    console.log("Stock ID:", item.stock);

    const stock = await Stock.findById(item.stock);

    console.log("Stock Data:", stock);

    if (!stock) {
        return res.status(404).json({
            success: false,
            message: "Stock not found"
        });
    }

    stock.currentStock += item.quantity;
    await stock.save();
}

        res.status(201).json({
            success: true,
            message: "Purchase added successfully",
            data: purchase,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// purchase update

export const updatePurchase = async (req, res) => {
    try {
        const purchaseitems = await Purchase.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!purchaseitems) {
            return res.status(404).json({
                success: false,
                message: "purchase items not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "purchase update successfully ",
            purchase: purchaseitems,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// delete purchase items 

export const deletePurchase = async (req, res) => {
    try {
        const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);

        if (!deletedPurchase) {
            return res.status(404).json({
                success: false,
                message: "purchase items not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "purchase deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};