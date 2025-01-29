import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";
import { UPDATE_USER } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import SelectField from "../components/ui/SelectField";
import InputField from "../components/ui/InputField";

export default function ProfilePage() {
  const { data, loading, error } = useQuery(GET_AUTHENTICATED_USER);

  const [updateUser, { loading: updating, error: updateError }] = useMutation(UPDATE_USER);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    gender: "",
    age: 0,
    weight: 0,
    height: 0,
    activity: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data?.authUser) {
      setFormData(data.authUser);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newValue =
        name === "age" || name === "weight" || name === "height"
          ? value === "" || isNaN(Number(value))
            ? ""
            : Number(value)
          : value;
      const newData = { ...prevData, [name]: newValue };
      setIsDirty(JSON.stringify(newData) !== JSON.stringify(data.authUser));
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const changedFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== data.authUser[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    if (Object.keys(changedFields).length === 0) {
      toast.success("No changes were made!");
      return;
    }

    try {
      const response = await updateUser({
        variables: {
          id: data.authUser._id,
          input: changedFields,
        },
      });

      const message = response.data.updateUser.message;
      toast.success(message);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Update your information
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Username"
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
        />
        <InputField
          label="Name"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          id="password"
          name="password"
          placeholder="********"
          type="password"
          value={formData.password || ""}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <SelectField
          label="Gender"
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        <InputField
          label="Age"
          id="age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />
        <InputField
          label="Weight (kg)"
          id="weight"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
        />
        <InputField
          label="Height (cm)"
          id="height"
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
        />
        <SelectField
          label="Activity Level"
          id="activity"
          name="activity"
          value={formData.activity}
          onChange={handleChange}
          options={[
            { label: "Sedentary", value: "sedentary" },
            { label: "Lightly Active", value: "lightly active" },
            { label: "Moderately Active", value: "moderately active" },
            { label: "Very Active", value: "very active" },
          ]}
        />
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={!isDirty || updating}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium px-4 py-2 rounded-lg hover:shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {updating ? "Saving..." : "Save changes"}
          </button>
          {updateError && (
            <p className="text-red-500 mt-2">Error: {updateError.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}