import { GraphQLError } from "graphql";

import User from "../models/user.model.js";

import sendOtpEmail from "../utils/otp/sendOtpEmail.js";
import generateOtp from "../utils/otp/generateOtp.js";

import { hashValue, compareHash } from "../utils/hashUtils.js";
import waterIntake from "../utils/waterIntake.js";
import basalMetabolism from "../utils/basalMetabolism.js";
import imc from "../utils/imc.js";
import customError from "../utils/customErrors.js";
import normalizeUsername from "../utils/normalizeUsername.js";
import mongoose from "mongoose";

import { PubSub } from "graphql-subscriptions";
import { CronJob } from "cron";
import Water from "../models/water.model.js";

const pubsub = new PubSub();
const HYDRATION_REMINDER = "HYDRATION_REMINDER";

const checkHydrationLevels = async () => {
  try {
    const users = await User.find();

    const now = new Date();
    const currentHour = now.getHours();

    for (const user of users) {
      const { _id, age, weight, gender, activity } = user;

      if (currentHour < 8 || currentHour > 22) return;

      const expectedWaterIntake = waterIntake({
        weight,
        age,
        activity,
        gender,
      });

      const hoursElapsed = currentHour - 8;
      const totalActiveHours = 14;

      const expectedWaterSoFar =
        (expectedWaterIntake / totalActiveHours) * hoursElapsed;

      const date = now.toISOString().split("T")[0];
      const waterEntry = await Water.findOne({ date, userId: _id });
      const waterConsumed = waterEntry ? waterEntry.quantity * 0.25 : 0;

      /* console.log(
        `User: ${_id}, Consumed: ${waterConsumed}ml, Expected: ${expectedWaterSoFar}ml`
      ); */

      if (waterConsumed < expectedWaterSoFar) {
        pubsub.publish(HYDRATION_REMINDER, {
          hydrationReminder: {
            userId: _id,
            message: `You should have consumed ${expectedWaterSoFar.toFixed(
              2
            )}ml of water by now`,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error verifying hydration:", error);
  }
};

// Config the cron job to run every 2 hours from 08:00 to 22:00
const waterJob = new CronJob("0 8-22/2 * * *", checkHydrationLevels);
waterJob.start();

const userResolver = {
  Mutation: {
    signUp: async (_, { input }) => {
      try {
        const {
          username,
          name,
          email,
          password,
          gender,
          age,
          weight,
          height,
          activity,
        } = input;
        if (
          !username ||
          !name ||
          !email ||
          !password ||
          !gender ||
          !age ||
          !weight ||
          !height ||
          !activity
        ) {
          throw customError.badRequest("Please fill all fields 123");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw customError.conflict("User already exists");
        }

        const hashedPassword = await hashValue(password);
        const verificationCode = generateOtp();
        const hashedVerificationCode = await hashValue(verificationCode);

        const normalizedUsername = normalizeUsername(username);
        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${normalizedUsername}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${normalizedUsername}`;

        const newUser = new User({
          username,
          name,
          email,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
          age,
          weight,
          height,
          activity,
          verificationCode: hashedVerificationCode,
        });

        await newUser.save();

        await sendOtpEmail(email, verificationCode);

        return {
          message:
            "Registration successful. Check your email to verify your account.",
        };
      } catch (error) {
        console.error("Error in signUp: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    verifyAccount: async (_, { email, verificationCode }, context) => {
      try {
        const user = await User.findOne({ email });

        if (!email || !verificationCode) {
          throw customError.badRequest("Please fill all fields");
        }

        if (!user) {
          throw customError.notFound("User not found");
        }

        const validVerificationCode = await compareHash(
          verificationCode,
          user.verificationCode
        );

        if (!validVerificationCode) {
          throw customError.badRequest("Invalid verification code");
        }

        user.isVerified = true;
        user.verificationCode = null;

        await user.save();
        await context.login(user);

        return user;
      } catch (error) {
        console.error("Error in verifyAccount: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    resendVerificationCode: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw customError.notFound("User not found");
        }

        const verificationCode = generateOtp();
        const hashedVerificationCode = await hashValue(verificationCode);

        user.verificationCode = hashedVerificationCode;
        await user.save();

        await sendOtpEmail(email, verificationCode);

        return { message: "Verification code sent to your email" };
      } catch (error) {
        console.error("Error in resendVerificationCode: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    signIn: async (_, { input }, context) => {
      try {
        const { email, password } = input;

        if (!email || !password) {
          throw customError.badRequest("Please fill all fields");
        }

        const userDatabase = await User.findOne({ email });

        if (!userDatabase) {
          throw customError.notFound("User not found");
        }

        if (!userDatabase.isVerified) {
          throw customError.notFound("User not found");
        }

        if (!userDatabase.isVerified) {
          throw customError.unauthorized(
            "Your account is not verified. Please check your email"
          );
        }

        const { user } = await context.authenticate("graphql-local", {
          email,
          password,
        });

        await context.login(user);

        return user;
      } catch (error) {
        console.error("Error in signIn: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();

        context.req.session.destroy((err) => {
          if (err) throw err;
        });

        context.res.clearCookie("connect.sid");

        return { message: "Logout successful" };
      } catch (error) {
        console.error("Error in logout: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    forgotPassword: async (_, { email }) => {
      try {
        if (!email) {
          throw customError.badRequest("Please fill all fields");
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw customError.notFound("User not found");
        }

        if (!user.isVerified) {
          throw customError.unauthorized("User not verified");
        }

        const resetPasswordCode = generateOtp();
        const hashedResetPasswordCode = await hashValue(resetPasswordCode);

        user.resetPasswordCode = hashedResetPasswordCode;
        await user.save();

        await sendOtpEmail(email, resetPasswordCode, "passwordReset");

        return { message: "Reset password code sent to your email" };
      } catch (error) {
        console.error("Error in forgotPassword: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    validateResetPasswordCode: async (_, { email, resetPasswordCode }) => {
      try {
        if (!email || !resetPasswordCode) {
          throw customError.badRequest("Please fill all fields");
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw customError.notFound("User not found");
        }

        if (!user.resetPasswordCode) {
          throw customError.badRequest("Reset password code not found");
        }

        const validResetPasswordCode = await compareHash(
          resetPasswordCode,
          user.resetPasswordCode
        );

        if (!validResetPasswordCode) {
          throw customError.badRequest("Invalid reset password code");
        }

        user.resetPasswordCode = null;
        await user.save();

        return {
          message:
            "Reset code validated successfully. You can now reset your password",
        };
      } catch (error) {
        console.error("Error in validateResetPasswordCode: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    resetPassword: async (_, { email, newPassword, confirmNewPassword }) => {
      try {
        if (!email || !newPassword || !confirmNewPassword) {
          throw customError.badRequest("Please fill all fields");
        }

        if (newPassword !== confirmNewPassword) {
          throw customError.badRequest("Password do not match");
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw customError.notFound("User not found");
        }

        if (user.resetPasswordCode) {
          throw customError.unauthorized(
            "Verify your reset password code first"
          );
        }

        const hashedPassword = await hashValue(newPassword);

        user.password = hashedPassword;
        await user.save();

        return {
          message:
            "Password reset successful. Redirecting you to the login page...",
        };
      } catch (error) {
        console.error("Error in resetPassword: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    resendResetPasswordCode: async (_, { email }) => {
      try {
        if (!email) {
          throw customError.badRequest("Please fill all fields");
        }

        const user = await User.findOne({ email });

        if (!user) {
          throw customError.notFound("User not found");
        }

        if (!user.isVerified) {
          throw customError.unauthorized(
            "Your account is not verified. Please validate your account"
          );
        }

        const resetPasswordCode = generateOtp();
        const hashedResetPasswordCode = hashValue(resetPasswordCode);

        user.resetPasswordCode = hashedResetPasswordCode;
        await user.save();

        await sendOtpEmail(email, resetPasswordCode, "passwordReset");

        return { message: "Reset password code sent to your email" };
      } catch (error) {
        console.error("Error in resendResetPasswordCode: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
    updateUser: async (_, { id, input }) => {
      try {
        const {
          username,
          name,
          email,
          password,
          gender,
          age,
          weight,
          height,
          activity,
        } = input;

        // Validate user ID
        if (!mongoose.isValidObjectId(id)) {
          throw customError.badRequest("Invalid user ID!");
        }

        // Find the user
        const user = await User.findById(id);
        if (!user) {
          throw customError.notFound("User not found!");
        }

        // Validation for unique username
        if (username) {
          const alreadyExistingUser = await User.findOne({ username });
          if (
            alreadyExistingUser &&
            alreadyExistingUser._id.toString() !== id
          ) {
            throw customError.conflict("Username already exists!");
          }
        }

        // Validation for unique email
        if (email) {
          const alreadyExistingEmail = await User.findOne({ email });
          if (
            alreadyExistingEmail &&
            alreadyExistingEmail._id.toString() !== id
          ) {
            throw customError.conflict("Email already exists!");
          }
        }

        // Update profile picture if username or gender changes
        let profilePicture = user.profilePicture;
        if (username || gender) {
          const normalizedUsername = normalizeUsername(
            username || user.username
          );
          const updatedGender = gender || user.gender;
          const genderKey = updatedGender === "male" ? "boy" : "girl";
          profilePicture = `https://avatar.iran.liara.run/public/${genderKey}?username=${normalizedUsername}`;
        }

        // Hash password if provided
        let hashedPassword = user.password;
        if (password) {
          hashedPassword = await hashValue(password);
        }

        // Build the update object dynamically
        const updateFields = {
          ...(username && { username }),
          ...(name && { name }),
          ...(email && { email }),
          ...(password && { password: hashedPassword }),
          ...(gender && { gender }),
          ...(profilePicture && { profilePicture }),
          ...(age && { age }),
          ...(weight && { weight }),
          ...(height && { height }),
          ...(activity && { activity }),
        };

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
          new: true,
        });

        return {
          message: "User updated successfully!",
        };
      } catch (error) {
        console.error("Error in updateUser:", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
  },
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.error("Error in authUser: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },

    getUserInfo: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) {
          throw customError.notFound("User not found");
        }

        const data = {
          weight: user.weight,
          age: user.age,
          activity: user.activity,
          height: user.height,
          gender: user.gender,
        };

        const water = waterIntake(data);
        const calories = basalMetabolism(data);
        const imcResults = imc(data);

        return {
          message: "User information fetched successfully",
          result: {
            water: water.toFixed(2),
            calories: calories.toFixed(2),
            imc: imcResults,
          },
        };
      } catch (error) {
        console.error("Error in getUserInfo: ", error);
        throw customError.internalServerError(
          error.message || "Internal Server Error"
        );
      }
    },
  },
  Subscription: {
    hydrationReminder: {
      subscribe: () => pubsub.asyncIterableIterator(HYDRATION_REMINDER),
    },
  },
};

export default userResolver;
