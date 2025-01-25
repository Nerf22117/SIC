import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import InputField from "../components/ui/InputField";

import {
  RESEND_RESET_PASSWORD_CODE,
  VALIDATE_RESET_PASSWORD_CODE,
} from "../graphql/mutations/user.mutation";

import obfuscateEmail from "../../utils/obfuscateEmail";

export default function VerifyPasswordResetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;

  const obfuscatedEmail = obfuscateEmail(email);

  const [code, setCode] = useState(["", "", "", ""]);

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;

    if (value.length === 1 && index < 3) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }

    setCode(newCode);
  };

  const [validateresetpassword, { loading, error }] = useMutation(
    VALIDATE_RESET_PASSWORD_CODE
  );

  const [
    resendresetpasswordcode,
    { loading: resendLoading, error: resendError },
  ] = useMutation(RESEND_RESET_PASSWORD_CODE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resetPasswordCode = code.join("");

    try {
      const response = await validateresetpassword({
        variables: {
          email,
          resetPasswordCode,
        },
      });

      const message = response.data.validateResetPasswordCode.message;
      toast.success(message);
      setTimeout(() => {
        navigate("/resetpassword", {
          state: { email },
        });
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendresetpasswordcode({ variables: { email } });

      const message = response.data.resendResetPasswordCode.message;

      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Verify Your Password Reset
            </h1>
            <p className="mb-6 text-center text-gray-600">
              We’ve sent a 4-digit verification code to <br />
              <span className="font-medium text-black">{obfuscatedEmail}</span>.
              Please enter it below to proceed.
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="flex space-x-2">
                {code.map((digit, index) => (
                  <InputField
                    key={index}
                    id={`code-input-${index}`}
                    name={`code-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    maxLength="1"
                    className="w-12 text-center border rounded-md"
                  />
                ))}
              </div>
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
                {loading ? "Verifying..." : "Verify"}
              </button>
              {error && (
                <p className="text-red-500 text-center">{error.message}</p>
              )}
            </form>
            <div className="flex justify-center">
              <button
                onClick={handleResendCode}
                className="mt-4 flex  text-blue-500 hover:underline cursor-pointer"
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend Verification Code"}
              </button>
              {resendError && (
                <p className="text-red-500 text-center">
                  {resendError.message}
                </p>
              )}
            </div>

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
