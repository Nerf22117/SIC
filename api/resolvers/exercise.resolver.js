import mongoose from "mongoose";
import User from "../models/user.model.js";
import Exercise from "../models/exercise.model.js";
import { GraphQLError } from "graphql";

const exerciseResolver = {
  Mutation: {
    createExercise: async (_, { input }) => {
      try {
        //Destructure the input
        const { userId, activity, calories, date, duration } = input;

        //If user don't exist, retrieve an error
        if (!userId) {
          throw new GraphQLError("User not Found!", {
            code: "NOT_FOUND",
            http: {
              status: 404,
            },
          });
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

          //Save the updated food
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
        });

        //Save the new exercise
        await newExercise.save();

        return {
          message: "Exercise added successfully",
        };
      } catch (error) {
        console.error("Error in get user Exercises: ", error);
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
    getUserExercises: async (_, { input }) => {
      try {
        //Destructure the input
        const { startDate, endDate, userId } = input;

        //Check if the userId is a valid ObjectId
        if (!mongoose.isValidObjectId(userId)) {
          throw new GraphQLError("Invalid user id!", {
            code: "INVALID_INPUT",
            http: {
              status: 400,
            },
          });
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

        //Retrieve the Exercises of the user
        const exercises = await Exercise.find(query);

        return {
          message: "Exercises retrieved!",
          result: exercises,
        };
      } catch (error) {
        console.error("Error in get user exercises: ", error);
        throw new GraphQLError(error, {
          code: "SERVER_ERROR",
          http: {
            status: 500,
          },
        });
      }
    },

    getDailyExerciseCalories: async (_, { id }) => {
      try {
        //Check if the userId is a valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
          throw new GraphQLError("Invalid user id!", {
            code: "INVALID_INPUT",
            http: {
              status: 400,
            },
          });
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

export default exerciseResolver;
