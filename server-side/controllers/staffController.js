import Staff from '../models/Staff.js'; // 

// (CREATE)
export const createStaff = async (req, res) => {
    try {
        const newStaff = new Staff(req.body);
        const savedStaff = await newStaff.save();
      return  res.status(201).json({ success: true, data: savedStaff });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAllStaff = async (req, res) => {
    console.log("getAllStaff Hit");
    try {
        const staffList = await Staff.find({});
        
        return res.status(200).json({
            success: true,
            message: "Staff list fetched successfully",
            data: staffList 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Database key fetch error", 
            error: error.message 
        });
    }
};

//(READ SINGLE)
export const getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  (UPDATE)
export const updateStaff = async (req, res) => {
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedStaff) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }
        res.status(200).json({ success: true, data: updatedStaff });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// (DELETE)
export const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }
        res.status(200).json({ success: true, message: 'Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};