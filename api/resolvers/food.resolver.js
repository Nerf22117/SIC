import mongoose from "mongoose";
import User from "../models/user.model.js";
import Food from "../models/food.model.js";
import { GraphQLError } from "graphql";

const foodResolver = {
  Mutation: {
    createFood: async (_, { input }) => {
      try {
        //Destructure the input
        const { userId, name, calories, date, quantity } = input;

        //If user don't exist, retrieve an error
        if (!userId) {
          throw new GraphQLError("User not Found!", {
            code: "NOT_FOUND",
            http: {
              status: 404,
            },
          });
        }

        //Check if user already has a food for the day
        const existingFood = await Food.findOne({ date, userId, name });

        //If user already has a food for the day, update the quantity
        if (existingFood) {
          existingFood.quantity += quantity;

          //Save the updated food
          await existingFood.save();

          return {
            message: "Food quantity updated!",
          };
        }

        //If user doesn't have a food in this day, create a new food
        const newFood = new Food({
          quantity,
          date,
          userId,
          calories,
          name,
        });

        //Save the new food
        await newFood.save();

        return {
          message: "Food added successfully",
        };
      } catch (error) {
        console.error("Error in get user foods: ", error);
        throw new GraphQLError(error, {
          code: "SERVER_ERROR",
          http: {
            status: 500,
          },
        });
      }
    },
  },
  Query: {
    getUserFoods: async (_, { input }) => {
      try {
        //Destructure the input
        const { startDate, endDate, userId } = input;

        //Check if the userId is a valid ObjectId
        if (!mongoose.isValidObjectId(userId)) {
          // TODO: Change the errors to graphql errors
          throw new Error("Invalid user id!");
        }

        const objectIdUserId = new mongoose.Types.ObjectId(userId);

        //Check if the user exists
        const user = await User.findById(objectIdUserId);

        if (!user) {
          throw new GraphQLError("User not Found!", {
            code: "NOT_FOUND",
            http: {
              status: 404,
            },
          });
        }

        let query = {
          userId: objectIdUserId,
        };

        if (startDate && endDate) {
          query.date = {
            $gte: startDate,
            $lte: endDate,
          };
        }

        //Retrieve the foods of the user
        const foods = await Food.find(query);

        return {
          message: "Foods retrieved!",
          result: foods,
        };
      } catch (error) {
        console.error("Error in get user water intake: ", error);
        throw new GraphQLError(error, {
          code: "SERVER_ERROR",
          http: {
            status: 500,
          },
        });
      }
    },

    getDailyCalories: async (_, { id }) => {
      try {
        //Check if the userId is a valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
          // TODO: Change the errors to graphql errors
          throw new Error("Invalid user id!");
        }

        const objectIdUserId = new mongoose.Types.ObjectId(id);

        //Check if the user exists
        const user = await User.findById(objectIdUserId);

        if (!user) {
          throw new GraphQLError("User not Found!", {
            code: "NOT_FOUND",
            http: {
              status: 404,
            },
          });
        }

        //Retrieve the foods of the user
        const foods = await Food.find({
          userId: objectIdUserId,
          date: new Date().toISOString().split("T")[0],
        });

        let totalCalories = 0;

        foods.forEach((food) => {
          totalCalories += food.calories * food.quantity;
        });

        return {
          message: "Calories retrieved!",
          result: totalCalories,
        };
      } catch (error) {
        console.error("Error in get daily calories: ", error);
        throw new GraphQLError(error, {
          code: "SERVER_ERROR",
          http: {
            status: 500,
          },
        });
      }
    },
  },
};

export default foodResolver;
