import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { LOGOUT } from "../graphql/mutations/user.mutation";

export default function HomePage() {
  const [logout, { loading }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div>
      <h1>Home Page</h1>
      {!loading && <button onClick={handleLogout}>Logout</button>}
      {loading && (
        <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
      )}
    </div>
  );
}
