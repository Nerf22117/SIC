const foodTypeDef = `#graphql
    type Food {
        _id: ID!
        name: String!
        calories:Int!
        date: String!
        quantity: Int!
        userId:ID!
    }

    type Query {
        getUserFoods(input: GetFoodsInput!): ResponseFoods
        getUserFood(input: GetFoodInput!): ResponseFood
    }

    type Mutation {
        createFood(input: WaterInput!): ResponseMessage
    }

    input GetFoodsInput {
        userId: ID!
        startDate: string
        endDate: string
    }

    input GetFoodInput {
        userId: ID!
        foodId: ID!
    }

    type ResponseMessage {
        message: String!
    }

    type ResponseWater {
        message: String!
        result: Food
    }
`;

export default foodTypeDef;
