import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    activity: {
      type: String,
      required: true,
      unique: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
      defaultValue: () => new Date().toISOString().split("T")[0],
    },
    calories: {
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

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
