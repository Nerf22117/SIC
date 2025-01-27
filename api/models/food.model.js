import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      reqyured: true,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;
