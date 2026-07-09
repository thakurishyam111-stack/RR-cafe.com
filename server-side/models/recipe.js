import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      default: "",
      trim: true,
    },
    unit: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
      unique: true,
      index: true,
    },
    menuTitle: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: [ingredientSchema],
      default: [],
    },
    preparationTime: {
      type: String,
      default: "20",
    },
    servingSize: {
      type: String,
      default: "1",
    },
    instructions: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe;
