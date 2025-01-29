import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import RadioButton from "../components/ui/RadioButton";
import InputField from "../components/ui/InputField";
import SelectField from "../components/ui/SelectField";

import { SIGN_UP } from "../graphql/mutations/user.mutation";

const steps = ["Basic Information", "Account Details", "Health & Activity"];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [signUpData, setSignUpData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    activity: "",
  });

  const [signup, { loading, error }] = useMutation(SIGN_UP, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeStep !== steps.length - 1) return;
    try {
      const response = await signup({
        variables: {
          input: {
            name: signUpData.name,
            username: signUpData.username,
            email: signUpData.email,
            password: signUpData.password,
            gender: signUpData.gender,
            age: Number(signUpData.age),
            weight: Number(signUpData.weight),
            height: Number(signUpData.height),
            activity: signUpData.activity,
          },
        },
      });

      const message = response.data.signUp.message;
      toast.success(message);

      setTimeout(() => {
        navigate("/verifyaccount", {
          state: { email: signUpData.email },
        });
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setSignUpData((prevData) => ({
        ...prevData,
        gender: value,
      }));
    } else {
      setSignUpData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex rounded-lg overflow-hidden z-50 bg-red-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Sign Up
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Join our community today!
            </h1>
            <Stepper activeStep={activeStep} alternativeLabel className="mb-6">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <>
                  <InputField
                    label="Full Name"
                    id="name"
                    name="name"
                    value={signUpData.name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Age"
                    id="age"
                    name="age"
                    type="number"
                    value={signUpData.age}
                    onChange={handleChange}
                  />
                </>
              )}
              {activeStep === 1 && (
                <>
                  <InputField
                    label="Username"
                    id="username"
                    name="username"
                    value={signUpData.username}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={signUpData.email}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    value={signUpData.password}
                    onChange={handleChange}
                  />
                </>
              )}
              {activeStep === 2 && (
                <>
                  <InputField
                    label="Weight (kg)"
                    id="weight"
                    name="weight"
                    type="number"
                    value={signUpData.weight}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Height (cm)"
                    id="height"
                    name="height"
                    type="number"
                    value={signUpData.height}
                    onChange={handleChange}
                  />
                  <SelectField
                    label="Activity Level"
                    id="activity"
                    name="activity"
                    value={signUpData.activity}
                    onChange={handleChange}
                    options={[
                      { label: "Sedentary", value: "sedentary" },
                      { label: "Lightly Active", value: "lightly active" },
                      {
                        label: "Moderately Active",
                        value: "moderately active",
                      },
                      { label: "Very Active", value: "very active" },
                    ]}
                  />
                  <div className="flex gap-10">
                    <RadioButton
                      id="male"
                      label="Male"
                      name="gender"
                      value="male"
                      onChange={handleChange}
                      checked={signUpData.gender === "male"}
                    />
                    <RadioButton
                      id="female"
                      label="Female"
                      name="gender"
                      value="female"
                      onChange={handleChange}
                      checked={signUpData.gender === "female"}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between mt-4">
                <button
                  className="w-16 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </button>

                {activeStep < steps.length - 1 ? (
                  <button
                    className="w-16 bg-black text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-16 bg-black text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Sign Up"}
                  </button>
                )}
              </div>
              {error && <p className="text-red-500 mt-2">{error.message}</p>}
            </form>
            <p className="mt-6 text-sm text-gray-500 text-center">
              Already have an account? <br />
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
