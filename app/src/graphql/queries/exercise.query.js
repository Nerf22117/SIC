import { gql } from "@apollo/client";

export const GET_USER_EXERCISES = gql`
  query GetUserExercises(
    $input: GetExercisesInput!
    $limit: Int
    $offset: Int
    $order: OrderEnum
    $search: String
    $category: String
  ) {
    getUserExercises(
      input: $input
      limit: $limit
      offset: $offset
      order: $order
      search: $search
      category: $category
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

export const GET_EXERCISE_USER_CATEGORIES = gql`
  query GetUserExerciseCategory($getUserExerciseCategoryId: ID!) {
    getUserExerciseCategory(id: $getUserExerciseCategoryId) {
      message
      result
    }
  }
`;
