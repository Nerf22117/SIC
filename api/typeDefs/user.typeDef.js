const userTypeDef = `#graphql
    type User {
        _id: ID!
        username: String!
        name: String!
        email: String!
        password: String!
        gender: String!
        profilePicture: String!
        age: Int!
        weight: Float!
        height: Float!
        activity: String!
        isVerified: Boolean!
        verificationCode: String
        resetPasswordCode: String
    }

    type Query {
        authUser: User
        getUserInfo(id: ID!): ResponseInfo
    }

    type Mutation {
        signUp(input: SignUpInput!): ResponseMessage
        verifyAccount(email: String!, verificationCode: String!): User
        resendVerificationCode(email: String!): ResponseMessage
        signIn(input: SignInInput!): User
        logout: ResponseMessage
        forgotPassword(email: String!): ResponseMessage
        validateResetPasswordCode(email: String!, resetPasswordCode: String!): ResponseMessage
        resetPassword(email: String!, newPassword: String!, confirmNewPassword: String!): ResponseMessage
        resendResetPasswordCode(email: String!): ResponseMessage
        updateUser(id: ID!, input: UpdateUserInput!): ResponseMessage
    }

    type Subscription {
        hydrationReminder: HydrationReminderResponseMessage
    }

    input SignUpInput {
        username: String!
        name: String!
        email: String!
        password: String! 
        gender: String!
        age: Int!
        weight: Float!
        height: Float!
        activity: String!
    }

    input SignInInput {
        email: String!
        password: String!
    }

    input UpdateUserInput {
        username: String
        name: String
        email: String
        password: String
        gender: String
        age: Int
        weight: Float
        height: Float
        activity: String
    }
    
    type IMC {
        value: Float!
        category: String!
    }

    type ResponseMessage {
        message: String!
    }

    type HydrationReminderResponseMessage{
        userId: ID!
        message: String!
    }

    type UserInfo {
        water: Float!
        calories: Float!
        imc: IMC!
    }

    type ResponseInfo {
        message: String!
        result: UserInfo!
    }

`;

export default userTypeDef;
