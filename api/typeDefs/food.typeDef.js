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
        getDailyCalories(id:ID!): ResponseCalories
    }

    type Mutation {
        createFood(input: FoodInput!): ResponseMessage
    }

    input GetFoodsInput {
        userId: ID!
        startDate: String
        endDate: String
    }

    input GetFoodInput {
        userId: ID!
        foodId: ID!
    }

    input FoodInput {
        userId:ID!
        name: String!
        calories:Int!
        date: String!
        quantity: Int!
    }

    type ResponseMessage {
        message: String!
    }

    type ResponseFoods {
        message: String!
        result: [Food]
    }

    type ResponseFood {
        message: String!
        result: Food
    }

    type ResponseCalories {
        message: String!
        result: Int!
    }
`;

export default foodTypeDef;
