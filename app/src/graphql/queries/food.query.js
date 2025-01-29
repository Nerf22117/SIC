import { gql } from "@apollo/client";

export const GET_USER_FOODS = gql`
  query GetUserFoods(
    $input: GetFoodsInput!
    $limit: Int
    $offset: Int
    $order: OrderEnum
    $search: String
  ) {
    getUserFoods(
      input: $input
      limit: $limit
      offset: $offset
      order: $order
      search: $search
    ) {
      message
      result {
        _id
        calories
        date
        name
        quantity
        image
        userId
        foodId
      }
    }
  }
`;

export const GET_CALORIES_DATES = gql`
  query GetUserCaloriesDate($input: GetFoodsInput!) {
    getCaloriesDate(input: $input) {
      message
      result{
        date
        calories
      }
    }
  }
`;