import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  role: { type: String, default: "casher" },
});

export default mongoose.model("User", userSchema);