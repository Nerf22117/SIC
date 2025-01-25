import { useLocation } from "react-router-dom";
import { useState } from "react";
import InputField from "../components/ui/InputField";
import { toast } from "react-hot-toast";
import {
  VERIFY_ACCOUNT,
  RESEND_VERIFICATION_CODE,
} from "../graphql/mutations/user.mutation";
import { useMutation } from "@apollo/client";

export default function VerifyAccountPage() {
  const location = useLocation();
  const email = location.state.email;

  const obfuscateEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const obfuscatedLocal =
      localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
    return `${obfuscatedLocal}@${domain}`;
  };

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
      const response = await verifyaccount({
        variables: {
          email,
          verificationCode,
        },
      });
      toast.success("Account verified successfully");
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
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Verify Your Account</h1>
      {email && (
        <p className="mt-2">
          Enter the verification code sent to {obfuscatedEmail}
        </p>
      )}
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
        {resendLoading ? "Resending..." : "Resend verification code"}
      </button>
      {resendError && (
        <p className="text-red-500 text-center">{resendError.message}</p>
      )}
    </div>
  );
}
