import { gql } from "@apollo/client";

export const CREATE_FOOD = gql`
    mutation CreateFood($input: FoodInput!) {
        createFood(input: $input) {
            message
        }
    }
`;	