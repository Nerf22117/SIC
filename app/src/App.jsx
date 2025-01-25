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

function App() {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={data.authUser ? <HomePage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/signin"
          element={!data.authUser ? <SignInPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!data.authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/verifyaccount"
          element={!data.authUser ? <VerifyAccountPage /> : <Navigate to="/" />}
        />
        <Route
          path="/forgotpassword"
          element={
            !data.authUser ? <ForgotPasswordPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/verifypasswordreset"
          element={
            !data.authUser ? <VerifyPasswordResetPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/resetpassword"
          element={!data.authUser ? <ResetPasswordPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
