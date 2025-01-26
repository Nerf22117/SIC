import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";

import InputField from "../components/ui/InputField";

import { Sign_IN } from "../graphql/mutations/user.mutation";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signin, { loading, error }] = useMutation(Sign_IN, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin({
        variables: {
          input: loginData,
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      if (
        error.message ===
        "Your account is not verified. Please check your email."
      ) {
        if (loginData.email) {
          setTimeout(() => {
            navigate("/verifyaccount", {
              state: { email: loginData.email },
            });
          }, 3000);
        } else {
          toast.error("Email is required to verify your account.");
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Login
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Welcome back! Log in to your account
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
              />

              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
              />
              <div className="flex justify-end">
                <Link
                  to="/forgotpassword"
                  className="text-sm text-black hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed
									"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
                {error && (
                  <p className="text-red-500 text-sm text-center">
                    {error.message}
                  </p>
                )}
              </div>
            </form>
            <p className="mt-6 text-sm text-gray-500 text-center">
              Don't have an account? <br />
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
