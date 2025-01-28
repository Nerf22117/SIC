import { gql } from "@apollo/client";

export const CREATE_WATER = gql`
    mutation CreateWater($input: WaterInput!) {
        createWater(input: $input) {
            message
        }
    }
`;	

export const REMOVE_WATER = gql`
    mutation RemoveWater($input: WaterInput!) {
        removeWater(input: $input) {
            message
        }
    }
`;	