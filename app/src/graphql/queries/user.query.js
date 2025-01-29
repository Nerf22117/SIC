import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    authUser {
      _id
      username
      name
      email
      gender
      age
      weight
      height
      activity
      profilePicture
    }
  }
`;
