import { GraphQLError } from "graphql";

import User from "../models/user.model.js";

import sendOtpEmail from "../utils/otp/sendOtpEmail.js";
import generateOtp from "../utils/otp/generateOtp.js";

import { hashValue, compareHash } from "../utils/hashUtils.js";
import waterIntake from "../utils/waterIntake.js";
import basalMetabolism from "../utils/basalMetabolism.js";
import imc from "../utils/imc.js";
import customError from "../utils/customErrors.js";

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

        const newUser = new User({
          username,
          name,
          email,
          password: hashedPassword,
          gender,
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
};

export default userResolver;
