import Supplier from "../models/supplier.js";

// get supplier
export const getsupplier = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json({
            success: true,
            suppliers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// get single supplier
export const singlesupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found",
            });
        }

        res.status(200).json({
            success: true,
            supplier,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// create supplier
export const createsuppliers = async (req, res) => {
    try {
        const addsupplier = await Supplier.create(req.body);
        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            supplier: addsupplier,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// update supplier
export const updatesupplier = async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        if (!updatedSupplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            supplier: updatedSupplier,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// delete supplier
export const deletesuppliers = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!deletedSupplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
