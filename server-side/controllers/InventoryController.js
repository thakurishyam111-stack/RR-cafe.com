import Inventory from "../models/Inventory";


export const getInventory = async (req, res) => {
    try{
        const inventory =await Inventory.find();

        return res.status(200).json({
            success: true,
            count: inventory.length,
            data: inventory,
        });

    }catch(exception){
        return res.status(500).json({
            success: false,
            message: exception.message,
          });
    }
}
