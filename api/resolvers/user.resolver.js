import { GraphQLError } from "graphql";

import User from "../models/user.model.js";

import sendOtpEmail from "../utils/otp/sendOtpEmail.js";
import generateOtp from "../utils/otp/generateOtp.js";

import { hashValue, compareHash } from "../utils/hashUtils.js";
import waterIntake from "../utils/waterIntake.js";
import basalMetabolism from "../utils/basalMetabolism.js";
import imc from "../utils/imc.js";

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
          throw new GraphQLError("Please fill all fields", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new GraphQLError("User already exists", {
            code: "BAD_REQUEST",
            http: 400,
          });
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
        // TODO: Change the errors to graphql errors
        console.error("Error in signUp: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    verifyAccount: async (_, { email, verificationCode }, context) => {
      try {
        const user = await User.findOne({ email });

        if (!email || !verificationCode) {
          throw new GraphQLError("Please fill all fields", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        if (!user) {
          throw new GraphQLError("User not found", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const validVerificationCode = await compareHash(
          verificationCode,
          user.verificationCode
        );

        if (!validVerificationCode) {
          throw new GraphQLError("Invalid verification code", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        user.isVerified = true;
        user.verificationCode = null;

        await user.save();
        await context.login(user);

        return user;
      } catch (error) {
        // TODO: Change the errors to graphql errors
        console.error("Error in verifyAccount: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    resendVerificationCode: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          // TODO: Change the errors to graphql errors

          throw new GraphQLError("User not found", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const verificationCode = generateOtp();
        const hashedVerificationCode = await hashValue(verificationCode);

        user.verificationCode = hashedVerificationCode;
        await user.save();

        await sendOtpEmail(email, verificationCode);

        return { message: "Verification code sent to your email" };
      } catch (error) {
        // TODO: Change the errors to graphql errors
        console.error("Error in resendVerificationCode: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    signIn: async (_, { input }, context) => {
      try {
        const { email, password } = input;

        if (!email || !password) {
          // TODO: Change the errors to graphql errors
          throw new GraphQLError("Please fill all fields", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const userDatabase = await User.findOne({ email });

        if (!userDatabase) {
          // TODO: Change the errors to graphql errors
          throw new Error("User not found");
        }

        if (!userDatabase.isVerified) {
          // TODO: Change the errors to graphql errors
          throw new GraphQLError("User not found", {
            code: "NOT_FOUND",
            http: 404,
          });
        }

        if (!userDatabase.isVerified) {
          throw new GraphQLError(
            "Your account is not verified. Please check your email",
            {
              code: "UNAUTHORIZED",
              http: 401,
            }
          );
        }

        const { user } = await context.authenticate("graphql-local", {
          email,
          password,
        });

        await context.login(user);

        return user;
      } catch (error) {
        // TODO: Change the errors to graphql errors
        console.error("Error in signIn: ", error);
        throw new Error(error.message || "Internal Server Error");
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
        // TODO: Change the errors to graphql errors
        console.error("Error in logout: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    forgotPassword: async (_, { email }) => {
      try {
        if (!email) {
          // TODO: Change the errors to graphql errors

          throw new GraphQLError("Please fill all fields", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const user = await User.findOne({ email });
        if (!user) {
          // TODO: Change the errors to graphql errors
          throw new Error("User not found");
        }

        if (!user.isVerified) {
          // TODO: Change the errors to graphql errors
          throw new GraphQLError("User not found", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        if (!user.isVerified) {
          throw new GraphQLError(
            "Your account is not verified. Please validate your account.",
            {
              code: "UNAUTHORIZED",
              http: 401,
            }
          );
        }

        const resetPasswordCode = generateOtp();
        const hashedResetPasswordCode = await hashValue(resetPasswordCode);

        user.resetPasswordCode = hashedResetPasswordCode;
        await user.save();

        await sendOtpEmail(email, resetPasswordCode, "passwordReset");

        return { message: "Reset password code sent to your email" };
      } catch (error) {
        // TODO: Change the errors to graphql errors
        console.error("Error in forgotPassword: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    validateResetPasswordCode: async (_, { email, resetPasswordCode }) => {
      try {
        if (!email || !resetPasswordCode) {
          // TODO: Change the errors to graphql errors
          throw new GraphQLError("Please fill all fields", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const user = await User.findOne({ email });
        if (!user) {
          // TODO: Change the errors to graphql errors
          throw new Error("User not found");
        }

        if (!user.resetPasswordCode) {
          // TODO: Change the errors to graphql errors
          throw new GraphQLError("User not found", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        if (!user.resetPasswordCode) {
          throw new GraphQLError("Reset password code not found", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const validResetPasswordCode = await compareHash(
          resetPasswordCode,
          user.resetPasswordCode
        );

        if (!validResetPasswordCode) {
          // TODO: Change the errors to graphql errors
          throw new GraphQLError("Invalid reset password code", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        user.resetPasswordCode = null;
        await user.save();

        return {
          message:
            "Reset code validated successfully. You can now reset your password",
        };
      } catch (error) {
        // TODO: Change the errors to graphql errors
        console.error("Error in validateResetPasswordCode: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    resetPassword: async (_, { email, newPassword, confirmNewPassword }) => {
      try {
        if (!email || !newPassword || !confirmNewPassword) {
          throw new GraphQLError("Please fill all fields", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        if (newPassword !== confirmNewPassword) {
          throw new GraphQLError("Password do not match", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const user = await User.findOne({ email });
        if (!user) {
          // TODO: Change the errors to graphql errors
          throw new Error("User not found");
        }

        if (user.resetPasswordCode) {
          // TODO: Change the errors to graphql errors
          throw new GraphQLError("User not found", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        if (user.resetPasswordCode) {
          throw new GraphQLError("Verify your reset password code first", {
            code: "UNAUTHORIZED",
            http: 401,
          });
        }

        const hashedPassword = await hashValue(newPassword);

        user.password = hashedPassword;
        await user.save();

        return {
          message:
            "Password reset successful. Redirecting you to the login page...",
        };
      } catch (error) {
        // TODO: Change the errors to graphql errors
        console.error("Error in resetPassword: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    resendResetPasswordCode: async (_, { email }) => {
      try {
        if (!email) {
          throw new GraphQLError("Please fill all fields", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        const user = await User.findOne({ email });

        if (!user) {
          // TODO: Change the errors to graphql errors
          throw new Error("User not found");
        }

        if (!user.isVerified) {
          throw new GraphQLError("User not found", {
            code: "BAD_REQUEST",
            http: 400,
          });
        }

        if (!user.isVerified) {
          throw new GraphQLError(
            "Your account is not verified. Please validate your account",
            {
              code: "UNAUTHORIZED",
              http: 400,
            }
          );
        }

        const resetPasswordCode = generateOtp();
        const hashedResetPasswordCode = hashValue(resetPasswordCode);

        user.resetPasswordCode = hashedResetPasswordCode;
        await user.save();

        await sendOtpEmail(email, resetPasswordCode, "passwordReset");

        return { message: "Reset password code sent to your email" };
      } catch (error) {
        // TODO: Change the errors to graphql errors
        console.error("Error in resendResetPasswordCode: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
  },
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        // TODO: Change the errors to graphql errors
        console.error("Error in authUser: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },

    getUserInfo: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) {
          // TODO: Change the errors to graphql errors
          throw new Error("User not found");
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
        // TODO: Change the errors to graphql errors
        console.error("Error in getUserInfo: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
  },
};

export default userResolver;
