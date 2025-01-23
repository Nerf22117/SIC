const userTypeDef = `#graphql
    type User {
        _id: ID!
        username: String!
        name: String!
        email: String!
        password: String!
        gender: String!
    }

    type Query {
        authUser: User
    }

    type Mutation {
        signUp(input: SignUpInput!): User
        signIn(input: SignInInput!): User
        logout: LogoutResponse
    }

    input SignUpInput {
        username: String!
        name: String!
        email: String!
        password: String! 
        gender: String!
    }

    input SignInInput {
        email: String!
        password: String!
    }

    type LogoutResponse {
        message: String!
    }
`;

export default userTypeDef;
