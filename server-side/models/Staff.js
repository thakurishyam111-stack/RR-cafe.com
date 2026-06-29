import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Staff name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Staff role is required'],
        enum: ['Manager', 'Chef', 'Waiter', 'Cashier', 'Admin'],
        default: 'Waiter'
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required']
    },
    image: {
        type: String, 
        required: true,
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Leave'],
        default: 'Active'
    }
}, {
    timestamps: true 
});

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;