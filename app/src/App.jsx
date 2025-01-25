import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyPasswordResetPage from "./pages/VerifyPasswordResetPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";

import { Toaster } from "react-hot-toast";

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/verifyaccount", element: <VerifyAccountPage /> },
  { path: "/forgotpassword", element: <ForgotPasswordPage /> },
  { path: "/verifypasswordreset", element: <VerifyPasswordResetPage /> },
  { path: "/resetpassword", element: <ResetPasswordPage /> },
];

function App() {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const renderRoute = (route) => {
    const isAuthenticated = data.authUser;
    if (route.path === "/" && !isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    if (route.path !== "/" && isAuthenticated) {
      return <Navigate to="/" />;
    }
    return route.element;
  };

  return (
    <>
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
      <Toaster />
    </>
  );
}

export default App;
