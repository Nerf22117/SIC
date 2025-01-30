import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";

import InputField from "../components/ui/InputField";

import {
  VERIFY_ACCOUNT,
  RESEND_VERIFICATION_CODE,
} from "../graphql/mutations/user.mutation";

import obfuscateEmail from "../../utils/obfuscateEmail";

export default function VerifyAccountPage() {
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

  const [verifyaccount, { loading, error }] = useMutation(VERIFY_ACCOUNT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [resendCode, { loading: resendLoading, error: resendError }] =
    useMutation(RESEND_VERIFICATION_CODE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      await verifyaccount({
        variables: {
          email,
          verificationCode,
        },
      });
      toast.success("Account verified successfully");
      setTimeout(() => {
        window.location.href = "/";
      },3000)
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendCode({ variables: { email } });

      const message = response.data.resendVerificationCode.message;

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
              Verify Your Account
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
                    className="w-12  text-center border rounded-md"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-black transition-colors duration-300"
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
                className="mt-4 text-blue-500 flex hover:underline cursor-pointer"
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend verification code"}
              </button>
              {resendError && (
                <p className="text-red-500 text-center">
                  {resendError.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
