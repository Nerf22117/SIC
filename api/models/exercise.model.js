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
    muscularGroup: {
      type: String,
      required: true,
    },
    gif: {
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

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
