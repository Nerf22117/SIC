import { GraphQLError } from "graphql";

/**
 * Custom error utility for generating GraphQL errors with specific HTTP status codes.
 */
const customError = {
  /**
   * Generates a GraphQL error for a bad request (HTTP 400).
   * @param {string} message - The error message.
   * @returns {GraphQLError} The GraphQL error object.
   */
  badRequest: (message) => {
    return new GraphQLError(message, {
      extensions: {
        code: "BAD_REQUEST",
        http: 400,
      },
    });
  },

  /**
   * Generates a GraphQL error for unauthorized access (HTTP 401).
   * @param {string} message - The error message.
   * @returns {GraphQLError} The GraphQL error object.
   */
  unauthorized: (message) => {
    return new GraphQLError(message, {
      extensions: {
        code: "UNAUTHORIZED",
        http: 401,
      },
    });
  },

  /**
   * Generates a GraphQL error for forbidden access (HTTP 403).
   * @param {string} message - The error message.
   * @returns {GraphQLError} The GraphQL error object.
   */
  forbidden: (message) => {
    return new GraphQLError(message, {
      extensions: {
        code: "FORBIDDEN",
        http: 403,
      },
    });
  },

  /**
   * Generates a GraphQL error for a not found resource (HTTP 404).
   * @param {string} message - The error message.
   * @returns {GraphQLError} The GraphQL error object.
   */
  notFound: (message) => {
    return new GraphQLError(message, {
      extensions: {
        code: "NOT_FOUND",
        http: 404,
      },
    });
  },

  /**
   * Generates a GraphQL error for a conflict (HTTP 409).
   * @param {string} message - The error message.
   * @returns {GraphQLError} The GraphQL error object.
   */
  conflict: (message) => {
    return new GraphQLError(message, {
      extensions: {
        code: "CONFLICT",
        http: 409,
      },
    });
  },

  /**
   * Generates a GraphQL error for an internal server error (HTTP 500).
   * @param {string} message - The error message.
   * @returns {GraphQLError} The GraphQL error object.
   */
  internalServerError: (message) => {
    return new GraphQLError(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: 500,
      },
    });
  },
};

export default customError;
