import mongoose, { get } from "mongoose";

import User from "../models/user.model.js";
import Exercise from "../models/exercise.model.js";

import customError from "../utils/customErrors.js";

import { sortExercises } from "../utils/sort.js";

const exerciseResolver = {
  Mutation: {
    createExercise: async (_, { input }) => {
      try {
        //Destructure the input
        const {
          userId,
          activity,
          calories,
          date,
          duration,
          muscularGroup,
          gif,
        } = input;

        //If user don't exist, retrieve an error
        if (!userId) {
          throw customError.unauthorized("You are not authenticated");
        }

        //Check if user already has a exercise for the day
        const existingExercise = await Exercise.findOne({
          date,
          userId,
          activity,
        });

        //If user already has a exercise for the day, update the duration
        if (existingExercise) {
          existingExercise.duration += duration;

          //Save the updated exercise
          await existingExercise.save();

          return {
            message: "Exercise duration updated!",
          };
        }

        //If user doesn't have a exercise in this day, create a new exercise
        const newExercise = new Exercise({
          duration,
          date,
          userId,
          calories,
          activity,
          muscularGroup,
          gif,
        });

        //Save the new exercise
        await newExercise.save();

        return {
          message: "Exercise added successfully",
        };
      } catch (error) {
        console.error("Error in get user Exercises: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
  },
  Query: {
    getUserExercises: async (
      _,
      { input, limit = 10, offset = 0, order = "", search = "", category = "" }
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
          if (startDate > endDate) {
            throw customError.badRequest(
              "Start date must be less than end date!"
            );
          }

          query.date = {
            $gte: startDate,
            $lte: endDate,
          };
        }

        //Retrieve the Exercises of the user
        let exercises = await Exercise.find(query).skip(offset).limit(limit);

        if (search) {
          exercises = exercises.filter((exercise) =>
            exercise.activity.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (order) {
          exercises = sortExercises(exercises, order);
        }

        if (category) {
          exercises = exercises.filter(
            (exercise) => exercise.muscularGroup === category
          );
        }

        return {
          message: "Exercises retrieved!",
          result: exercises,
        };
      } catch (error) {
        console.error("Error in get user exercises: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },

    getDailyExerciseCalories: async (_, { id }) => {
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

        //Retrieve the exercises of the user
        const exercises = await Exercise.find({
          userId: objectIdUserId,
          date: new Date().toISOString().split("T")[0],
        });

        let totalCalories = 0;

        exercises.forEach((exercise) => {
          totalCalories += (exercise.calories * exercise.duration) / 60;
        });

        return {
          message: "Exercises calories retrieved!",
          result: totalCalories.toFixed(2),
        };
      } catch (error) {
        console.error("Error in get daily calories: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },

    getUserExerciseCategory: async (_, { id }) => {
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

        //Retrieve the exercises of the user
        const exercises = await Exercise.find({
          userId: objectIdUserId,
        });

        const categories = exercises.map((exercise) => exercise.muscularGroup);

        const uniqueCategories = [...new Set(categories)];

        return {
          message: "Categories retrieved!",
          result: uniqueCategories,
        };
      } catch (error) {
        console.error("Error in get user categories: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
  },
};

export default exerciseResolver;
