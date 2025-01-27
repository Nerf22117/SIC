import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { CREATE_WATER } from "../graphql/mutations/water.mutation";
import { useAuth } from "../context/AuthContext";
import { getCaloriesBurned } from "../api/exercises/api";

export default function ExercisesPage() {
    const { authUser } = useAuth();
    console.log("ExercisesPage");

    console.log(getCaloriesBurned("running"));

    return (
        <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
            <h2 className="text-xl font-bold">Hello {authUser?.name}</h2>
            <p>FOTO</p>
        </div>
    )
}