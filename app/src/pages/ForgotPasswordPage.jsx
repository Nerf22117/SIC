import { useState } from "react";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "../graphql/mutations/user.mutation";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword({
        variables: {
          email,
        },
      });

      const message = response.data.forgotPassword.message;
      toast.success(message);
      setTimeout(() => {
        navigate("/verifypasswordreset", {
          state: { email },
        });
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="mb-6 text-center text-gray-600">
        Enter your email address to receive a verification code to reset your
        password.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Verification Code"}
        </button>
        {error && <p className="text-red-500">{error.message}</p>}
      </form>
      <p className="mt-6 text-sm text-gray-500 text-center">
        Remembered your password? <br />
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Go back to login
        </span>
      </p>
    </div>
  );
}
