import mongoose from "mongoose";

const waterSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      defaultValue: 0,
      required: true,
    },
    date: {
      type: String,
      defaultValue: () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      },
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

const Water = mongoose.model("Water", waterSchema);

export default Water;
