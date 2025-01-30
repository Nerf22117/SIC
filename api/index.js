import express from "express";
import http from "http";
import cors from "cors";
import "./config/loadEnv.js";
import path from "path";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildContext } from "graphql-passport";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import { connectDB } from "./config/db.config.js";
import { configurePassport } from "./config/passport.config.js";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

// Initialize Passport strategies
configurePassport();

// Initialize Express application
const app = express();

// Get the current directory
const _dirname = path.resolve();

// Create an HTTP server
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
});

// Configure MongoDB session store
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI, // MongoDB connection URI from environment variables
  collection: "sessions", // Collection name for storing sessions
});

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // this option specifies whether to save the session to the store on every request
    saveUninitialized: false, // option specifies whether to save uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true, // prevent from Cross-Site Scripting (XSS) attacks
    },
    store, // Use MongoDB to store session data
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
// Enable persistent login sessions
app.use(passport.session());

// Initialize Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Configure WebSocket server
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
useServer({ schema }, wsServer);

// Start the Apollo Server
await server.start();

// Configure middleware for the /graphql endpoint
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000", // Allow requests from the frontend
    credentials: true, // Allow sending cookies
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Serve the frontend
// npm run build to build the frontend, optmized version of the frontend
app.use(express.static(path.join(_dirname, "app/dist")));

// Serve the frontend for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "app/dist", "index.html"));
});

// Start the HTTP server
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

// Connect to MongoDB
await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
