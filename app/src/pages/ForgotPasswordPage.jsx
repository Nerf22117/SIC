import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import InputField from "../components/ui/InputField";

import { FORGOT_PASSWORD } from "../graphql/mutations/user.mutation";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword({
        variables: { email },
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
    <div className="flex justify-center items-center h-screen">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Forgot Password
            </h1>
            <p className="mb-6 text-center text-gray-500">
              Enter your email address to receive a verification code to reset
              your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full bg-black text-white p-2 rounded-md transition-colors duration-300 
                    ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-800 cursor-pointer"
                    }`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
                {error && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {error.message}
                  </p>
                )}
              </div>
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
