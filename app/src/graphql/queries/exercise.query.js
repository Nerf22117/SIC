import { gql } from "@apollo/client";

export const GET_USER_EXERCISES = gql`
  query GetUserExercises(
    $input: GetExercisesInput!
    $limit: Int
    $offset: Int
    $order: OrderEnum
    $search: String
  ) {
    getUserExercises(
      input: $input
      limit: $limit
      offset: $offset
      order: $order
      search: $search
    ) {
      message
      result {
        _id
        activity
        calories
        date
        duration
        muscularGroup
        gif
      }
    }
  }
`;
