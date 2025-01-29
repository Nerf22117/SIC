const foodTypeDef = `#graphql
    type Food {
        _id: ID!
        name: String!
        calories:Int!
        date: String!
        quantity: Int!
        image: String!
        userId:ID!
        foodId: ID!
    }

    type Query {
        getUserFoods(input: GetFoodsInput!, limit:Int, offset:Int, order:OrderEnum, search:String): ResponseFoods
        getUserFood(input: GetFoodInput!): ResponseFood
        getDailyCalories(id:ID!): ResponseCalories
        getCaloriesDate(input: GetFoodsInput!): ResponseCaloriesArray
    }

    type Mutation {
        createFood(input: FoodInput!): ResponseMessage
        updateFood(input: FoodInput!): ResponseMessage
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
        image: String!
        foodId: ID!
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

    type ResponseCaloriesArray {
        message: String!
        result: [Food]
    }

    enum OrderEnum {
        NAME_ASC
        NAME_DESC
        DATE_ASC
        DATE_DESC
        CALORIES_ASC
        CALORIES_DESC
        QUANTITY_ASC
        QUANTITY_DESC
    }
`;

export default foodTypeDef;
