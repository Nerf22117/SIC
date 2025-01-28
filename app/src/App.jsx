import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyPasswordResetPage from "./pages/VerifyPasswordResetPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ExercisesPage from "./pages/ExercisesPage";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import SideBar from "./components/ui/SideBar";

const routes = [
  { path: "/", element: <HomePage />, showSideBar: true },
  { path: "/signin", element: <SignInPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/verifyaccount", element: <VerifyAccountPage /> },
  { path: "/forgotpassword", element: <ForgotPasswordPage /> },
  { path: "/verifypasswordreset", element: <VerifyPasswordResetPage /> },
  { path: "/resetpassword", element: <ResetPasswordPage /> },
  { path: "/exercises", element: <ExercisesPage />, showSideBar: true },
];

function App() {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);
  const { authUser, setAuthUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (data?.authUser && authUser?._id !== data.authUser._id) {
      setAuthUser(data.authUser);
    }
  }, [data, authUser, setAuthUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const renderRoute = (route) => {
    const isAuthenticated = !!data?.authUser;

    const protectedRoutes = ["/", "/exercises"];

    if (protectedRoutes.includes(route.path) && !isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }

    const publicRoutes = ["/signin", "/signup", "/forgotpassword", "/verifypasswordreset", "/resetpassword"];
    if (publicRoutes.includes(route.path) && isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return route.element;
  };

  const currentRoute = routes.find(route => route.path === location.pathname);

  return (
    <div className="flex">
      {currentRoute?.showSideBar && <SideBar />}
      <div className="flex-1 p-10">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={renderRoute(route)}
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;