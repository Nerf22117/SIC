import { gql } from "@apollo/client";

export const CREATE_WATER = gql`
    mutation CreateWater($input: WaterInput!) {
        createWater(input: $input) {
            message
        }
    }
`;	