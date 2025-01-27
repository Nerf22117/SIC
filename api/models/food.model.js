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
      type: Date,
      required: true,
      defaultValue: Date.now(),
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
