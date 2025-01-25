import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      message
    }
  }
`;

export const VERIFY_ACCOUNT = gql`
  mutation VerifyAccount($email: String!, $verificationCode: String!) {
    verifyAccount(email: $email, verificationCode: $verificationCode) {
      _id
      username
      name
    }
  }
`;

export const Sign_In = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      _id
      name
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
