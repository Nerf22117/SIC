import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendOtpEmail from "../utils/otp/sendOtpEmail.js";
import generateOtp from "../utils/otp/generateOtp.js";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }) => {
      try {
        const { username, name, email, password, gender } = input;
        if (!username || !name || !email || !password || !gender) {
          throw new Error("Please fill all fields");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists");
        }

        const saltNumber = parseInt(process.env.SALT_NUMBER);
        const salt = await bcrypt.genSalt(saltNumber);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationCode = generateOtp();
        const hashedVerificationCode = await bcrypt.hash(
          verificationCode,
          salt
        );

        const newUser = new User({
          username,
          name,
          email,
          password: hashedPassword,
          gender,
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
        throw new Error(error.message || "Internal Server Error");
      }
    },
    verifyAccount: async (_, { email, verificationCode }, context) => {
      try {
        const user = await User.findOne({ email });

        if (!email || !verificationCode) {
          throw new Error("Please fill all fields");
        }

        if (!user) {
          throw new Error("User not found");
        }

        const validVerificationCode = await bcrypt.compare(
          verificationCode,
          user.verificationCode
        );

        if (!validVerificationCode) {
          throw new Error("Invalid verification code");
        }

        user.isVerified = true;
        user.verificationCode = null;

        await user.save();
        await context.login(user);

        return user;
      } catch (error) {
        console.error("Error in verifyAccount: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    resendVerificationCode: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const verificationCode = generateOtp();
        const saltNumber = parseInt(process.env.SALT_NUMBER);
        const salt = await bcrypt.genSalt(saltNumber);
        const hashedVerificationCode = await bcrypt.hash(
          verificationCode,
          salt
        );

        user.verificationCode = hashedVerificationCode;
        await user.save();

        await sendOtpEmail(email, verificationCode);

        return { message: "Verification code sent to your email" };
      } catch (error) {
        console.error("Error in resendVerificationCode: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    signIn: async (_, { input }, context) => {
      try {
        const { email, password } = input;

        if (!email || !password) {
          throw new Error("Please fill all fields");
        }

        const userDatabase = await User.findOne({ email });

        if (!userDatabase) {
          throw new Error("User not found");
        }

        if (!userDatabase.isVerified) {
          throw new Error(
            "Your account is not verified. Please check your email."
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
        console.error("Error in logout: ", error);
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
        console.error("Error in authUser: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
  },
};

export default userResolver;
