import mongoose from "mongoose";

import User from "../models/user.model.js";
import Food from "../models/food.model.js";

import customError from "../utils/customErrors.js";
import { sortFoods } from "../utils/sort.js";

const foodResolver = {
  Mutation: {
    createFood: async (_, { input }) => {
      try {
        //Destructure the input
        const { userId, name, calories, date, quantity, image, foodId } = input;

        //If user don't exist, retrieve an error
        if (!userId) {
          throw customError.unauthorized("You are not authenticated");
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
          image,
          foodId,
        });

        //Save the new food
        await newFood.save();

        return {
          message: "Food added successfully",
        };
      } catch (error) {
        console.error("Error in get user foods: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    updateFood: async (_, { input }) => {
      try {
        //Destructure the input
        const { userId, foodId, quantity } = input;

        //Check if the userId is a valid ObjectId
        if (!mongoose.isValidObjectId(userId)) {
          throw customError.badRequest("Invalid user id!");
        }

        //Check if the foodId is a valid ObjectId
        if (!mongoose.isValidObjectId(foodId)) {
          throw customError.badRequest("Invalid food id!");
        }

        const objectIdUserId = new mongoose.Types.ObjectId(userId);
        const objectIdFoodId = new mongoose.Types.ObjectId(foodId);

        //Check if the user exists
        const user = await User.findById(objectIdUserId);

        if (!user) {
          throw customError.notFound("User not found!");
        }

        //Check if the food exists
        const food = await Food.findById(objectIdFoodId);

        if (!food) {
          throw customError.notFound("Food not found!");
        }

        //Update the food quantity
        food.quantity += quantity;

        //Save the updated food
        await food.save();

        return {
          message: "Food quantity updated!",
        };
      } catch (error) {
        console.error("Error in get user foods: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
  },
  Query: {
    getUserFoods: async (
      _,
      { input, limit = 10, offset = 0, order = "", search = "" }
    ) => {
      try {
        //Destructure the input
        const { startDate, endDate, userId } = input;

        //Check if the userId is a valid ObjectId
        if (!mongoose.isValidObjectId(userId)) {
          throw customError.badRequest("Invalid user id!");
        }

        const objectIdUserId = new mongoose.Types.ObjectId(userId);

        //Check if the user exists
        const user = await User.findById(objectIdUserId);

        if (!user) {
          throw customError.notFound("User not found!");
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
        let foods = await Food.find(query).skip(offset).limit(limit);

        if (search) {
          foods = foods.filter((food) =>
            food.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (order) {
          foods = sortFoods(foods, order);
        }

        return {
          message: "Foods retrieved!",
          result: foods,
        };
      } catch (error) {
        console.error("Error in get user foods: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },

    getDailyCalories: async (_, { id }) => {
      try {
        //Check if the userId is a valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
          throw customError.badRequest("Invalid user id!");
        }

        const objectIdUserId = new mongoose.Types.ObjectId(id);

        //Check if the user exists
        const user = await User.findById(objectIdUserId);

        if (!user) {
          throw customError.notFound("User not found!");
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
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
  },
};

export default foodResolver;
