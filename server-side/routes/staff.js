import express from 'express';
const router = express.Router();

import { 
    createStaff, 
    getAllStaff, 
    getStaffById, 
    updateStaff, 
    deleteStaff 
} from '../controllers/staffController.js'; 

// Routes 
router.post('/add', createStaff);
router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.put('/update/:id', updateStaff);
router.delete('/delete/:id', deleteStaff);

export default router;