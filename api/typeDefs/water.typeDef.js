const waterTypeDef = `#graphql
    type Water {
        _id: ID!
        quantity: Int!
        date: String!
        userId: ID!
    }

    type Query {
        getUserWaterIntake(input: GetWaterInput!): ResponseWater
    }

    type Mutation {
        createWater(input: WaterInput!): ResponseMessage
        removeWater(input: WaterInput!): ResponseMessage
    }

    input GetWaterInput {
        date: String!
        userId: ID!
    }

    input WaterInput {
        quantity: Int!
        date: String!
        userId: ID!
    }

    type ResponseMessage {
        message: String!
    }

    type ResponseWater {
        message: String!
        result: Water
    }

    
`;

export default waterTypeDef;
