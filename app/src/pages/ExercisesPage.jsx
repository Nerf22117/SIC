import { useState, useEffect } from "react";
import { getExercises } from "../api/exercises/api";
import { CREATE_EXERCISE } from "../graphql/mutations/exercise.mutation";
import { useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [muscularGroup, setMuscularGroup] = useState("");
  const [products, setProducts] = useState([]);
  const [muscularGroups, setMuscularGroups] = useState([]);
  const [durations, setDurations] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [createExercise, { loading, error }] = useMutation(CREATE_EXERCISE);
  const { authUser } = useAuth();

  useEffect(() => {
    getExercises().then((data) => {
      console.log("Data", data);
      const uniqueMuscularGroups = [
        ...new Set(data.map((product) => product.muscular_group)),
      ];
      setMuscularGroups(uniqueMuscularGroups);

      let filteredData = data;

      if (searchQuery) {
        filteredData = data.filter((product) =>
          product.activity.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (muscularGroup) {
        filteredData = filteredData.filter((product) =>
          product.muscular_group
            .toLowerCase()
            .includes(muscularGroup.toLowerCase())
        );
      }

      setProducts(filteredData);
    });
  }, [searchQuery, muscularGroup]);

  const handleAdd = async () => {
    const input = {
      activity: selectedExercise.activity,
      calories: selectedExercise.calories_per_hour,
      date: new Date().toISOString().split("T")[0],
      duration: durations[selectedExercise.id],
      userId: authUser?._id,
      muscularGroup: selectedExercise.muscular_group,
      gif: selectedExercise.gif,
    };

    try {
      await createExercise({ variables: { input } });
      toast.success("Exercise added to workout.");
      setModalIsOpen(false);
    } catch (err) {
      toast.error(error.message);
    }
  };

  const openModal = (exercise) => {
    setSelectedExercise(exercise);
    setDurations({ ...durations, [exercise.id]: 1 });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedExercise(null);
  };

  const decrementDuration = (id) => {
    setDurations((prev) => {
      const newDurations = { ...prev };
      newDurations[id] = newDurations[id] ? newDurations[id] - 1 : 0;
      return newDurations;
    });
  };

  const incrementDuration = (id) => {
    setDurations((prev) => {
      const newDurations = { ...prev };
      newDurations[id] = newDurations[id] ? newDurations[id] + 1 : 1;
      return newDurations;
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Exercises</h1>
        <div className="mb-6 flex justify-center space-x-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-2/3 border border-gray-300 p-2 md:w-1/1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
          />
          <select
            value={muscularGroup}
            onChange={(e) => setMuscularGroup(e.target.value)}
            className="w-1/3 border border-gray-300 p-2 md:w-1/1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
          >
            <option value="">Select muscular group</option>
            {muscularGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[60vh] overflow-y-auto">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-300 rounded-lg p-4 bg-white">
              <img
                src={product.gif}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover"
              />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {product.activity}
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                Calories per hour: {product.calories_per_hour}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Muscular group: {product.muscular_group}
              </p>
              <button
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => openModal(product)}
              >
                Add to workout
              </button>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">No exercises found.</p>
        )}
      </div>

      {modalIsOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white p-6 rounded-lg">
            {selectedExercise && (
              <>
                <h2 className="text-xl font-bold mb-4 flex justify-center">
                  {selectedExercise.activity}
                </h2>
                <div className="flex items-center mb-4 justify-center">
                  <div className="flex flex-col">
                    <button
                      className="bg-gray-300 text-gray-700 py-1 px-2 rounded-t cursor-pointer"
                      onClick={() =>
                        setDurations((prev) => ({
                          ...prev,
                          [selectedExercise.id]: durations[selectedExercise.id] + 1,
                        }))
                      }
                    >
                      +
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 py-1 px-2 rounded-b cursor-pointer"
                      onClick={() =>
                        setDurations((prev) => ({
                          ...prev,
                          [selectedExercise.id]:
                            durations[selectedExercise.id] > 1
                              ? durations[selectedExercise.id] - 1
                              : 1,
                        }))
                      }
                    >
                      -
                    </button>
                  </div>
                  <span className="px-4">{durations[selectedExercise.id]}</span>
                  <span className="ml-2">minutes</span>
                </div>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded mr-2 cursor-pointer"
                  onClick={handleAdd}
                  disabled={loading}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded cursor-pointer"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}