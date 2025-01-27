import mongoose from "mongoose";
import User from "../models/user.model.js";
import Water from "../models/water.model.js";

const waterResolver = {
  Mutation: {
    createWater: async (_, { input }) => {
      try {
        //Destructure the input
        const { quantity, date, userId } = input;

        //If user don't exists, retrieved an error
        if (!userId) {
          throw new Error("You are not authenticated!");
        }

        //Check if user already has a water intake for the day
        const existingWater = await Water.findOne({ date, userId });

        //If user already has a water intake for the day, update the quantity
        if (existingWater) {
          existingWater.quantity += quantity;

          //Save the updated water intake
          await existingWater.save();

          return {
            message: "Water intake updated!",
          };
        }

        //If user doesn't have a water intake for the day, create a new water intake
        const newWater = new Water({
          quantity,
          date,
          userId,
        });

        //Save the new water intake
        await newWater.save();

        return {
          message: "Water Intake created successfuly",
        };
      } catch (error) {
        console.error("Error in get user water intake: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
  },
  Query: {
    getUserWaterIntake: async (_, { input }) => {
      try {
        //Destructure the input
        const { date, userId } = input;

        //Check if the userId is a valid ObjectId
        if (!mongoose.isValidObjectId(userId)) {
          throw new Error("Invalid user id!");
        }

        const objectIdUserId = new mongoose.Types.ObjectId(userId);

        //Check if the user exists
        const user = await User.findById(objectIdUserId);

        if (!user) {
          throw new Error("User not found!");
        }

        //Retrieve the water intake of the user for the day
        const water = await Water.findOne({ date, userId: objectIdUserId });

        //If user doesn't have a water intake for the day, create a new water intake
        if (!water) {
          // Create a new water intake
          const newWater = new Water({
            quantity: 0,
            date,
            userId: objectIdUserId,
          });

          // Save the new water intake
          await newWater.save();

          return {
            message:
              "You haven't drunk water today, but a new entry was created!",
            result: {
              _id: newWater._id,
              quantity: newWater.quantity,
              date: newWater.date,
              userId: newWater.userId,
            },
          };
        }

        return {
          message: "Water intake retrieved!",
          result: {
            _id: water._id,
            quantity: water.quantity,
            date: water.date,
            userId: water.userId,
          },
        };
      } catch (error) {
        console.error("Error in get user water intake: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
  },
};

export default waterResolver;
