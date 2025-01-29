import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    foodId: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
      defaultValue: () => new Date().toISOString().split("T")[0],
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;
