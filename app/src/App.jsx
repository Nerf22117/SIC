import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";

import { Toaster } from "react-hot-toast";

function App() {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);
  console.log(data);

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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
