import { gql } from "@apollo/client";

export const CREATE_EXERCISE = gql`
  mutation CreateExercise($input: ExerciseInput!) {
    createExercise(input: $input) {
      message
    }
  }
`;
