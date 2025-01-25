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

export default function VerifyAccountPage() {
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
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Verify Your Password Reset</h1>
      <p className="text-center text-gray-600">
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
          className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        {error && <p className="text-red-500 text-center">{error.message}</p>}
      </form>
      <button
        onClick={handleResendCode}
        className="mt-4 text-blue-500 hover:underline"
        disabled={resendLoading}
      >
        {resendLoading
          ? "Resending..."
          : "Didn’t receive the code? Resend Verification Code"}
      </button>
      {resendError && (
        <p className="text-red-500 text-center">{resendError.message}</p>
      )}
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
