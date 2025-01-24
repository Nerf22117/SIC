import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  // TODO: Update the uri when deploying to production
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include", // To send cookies along with every request to the server
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>
);
