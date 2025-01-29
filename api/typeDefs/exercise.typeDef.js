const exerciseTypeDef = `#graphql
    type Exercise {
        _id: ID!
        activity: String!
        calories:Int!
        date: String!
        duration: Int!
        muscularGroup: String!
        gif: String!
        userId:ID!
    }

    type Query {
        getUserExercises(input: GetExercisesInput!, limit:Int, offset:Int, order:OrderEnum, search:String): ResponseExercises
        getUserExercise(input: GetExerciseInput!): ResponseExercise
        getDailyExerciseCalories(id:ID!): ResponseCalories
        getExercisesDates(input:GetExercisesInput!): ResponseExercises
    }

    type Mutation {
        createExercise(input: ExerciseInput!): ResponseMessage
    }

    input GetExercisesInput {
        userId: ID!
        startDate: String
        endDate: String
    }

    input GetExerciseInput {
        userId: ID!
        exerciseId: ID!
    }

    input ExerciseInput {
        userId:ID!
        activity: String!
        calories:Int!
        date: String!
        duration: Int!
        muscularGroup: String!
        gif: String!
    }

    type ResponseMessage {
        message: String!
    }

    type ResponseExercises {
        message: String!
        result: [Exercise]
    }

    type ResponseExercise {
        message: String!
        result: Exercise
    }

    type ResponseCalories {
        message: String!
        result: Int!
    }

    enum OrderEnum {
        NAME_ASC
        NAME_DESC
        DATE_ASC
        DATE_DESC
        CALORIES_ASC
        CALORIES_DESC
    }
`;

export default exerciseTypeDef;
