import { gql } from "@apollo/client";

export const GET_WATER_INTAKE = gql`
  query GetWaterIntakeUser($date: String!, $userId: ID!) {
    getUserWaterIntake(input: { date: $date, userId: $userId }) {
      message
      result {
        quantity
      }
    }
  }
`;

export const GET_WATER_OBJECTIVE_DAY = gql`
    query GetUserInfo ($id: ID!){
        getUserInfo(id: $id){
            result{
                water
            }
        }
    }
`;