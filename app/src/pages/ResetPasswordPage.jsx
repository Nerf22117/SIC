import { useState } from "react";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../graphql/mutations/user.mutation";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import obfuscateEmail from "../../utils/obfuscateEmail";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;

  const obfuscatedEmail = obfuscateEmail(email);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await resetPassword({
        variables: {
          email,
          newPassword: password,
          confirmNewPassword: confirmPassword,
        },
      });

      const message = response.data.resetPassword.message;
      toast.success(message);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      <p className="text-gray-600 text-center mb-6">
        Enter your new password for the account associated with <br />
        <span className="font-medium text-black">{obfuscatedEmail}</span>.
      </p>

      <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-1"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-2">{error.message}</p>
        )}
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
