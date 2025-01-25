import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { RESET_PASSWORD } from "../graphql/mutations/user.mutation";
import obfuscateEmail from "../../utils/obfuscateEmail";
import InputField from "../components/ui/InputField";

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
    <div className="flex justify-center items-center h-screen">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Reset Your Password
            </h1>
            <p className="mb-6 text-center text-gray-600">
              Enter your new password for the account associated with <br />
              <span className="font-medium text-black">{obfuscatedEmail}</span>.
            </p>

            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="New Password"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <InputField
                label="Confirm New Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-black transition-colors duration-300"
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
        </div>
      </div>
    </div>
  );
}
