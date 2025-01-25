import mongoose from "mongoose";

const waterSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      defaultValue: 0,
      required: true,
    },
    date: {
      type: Date,
      defaultValue: Date.now(),
      requried: true,
    },
  },
  { timestamps: true }
);

const Water = mongoose.model("Water", waterSchema);

export default Water;
