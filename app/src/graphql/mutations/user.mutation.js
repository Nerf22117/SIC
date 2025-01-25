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

export const RESEND_VERIFICATION_CODE = gql`
  mutation ResendVerificationCode($email: String!) {
    resendVerificationCode(email: $email) {
      message
    }
  }
`;

export const Sign_In = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      _id
      name
      isVerified
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

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
    }
  }
`;

export const VALIDATE_RESET_PASSWORD_CODE = gql`
  mutation ValidateResetPasswordCode(
    $email: String!
    $resetPasswordCode: String!
  ) {
    validateResetPasswordCode(
      email: $email
      resetPasswordCode: $resetPasswordCode
    ) {
      message
    }
  }
`;

export const RESEND_RESET_PASSWORD_CODE = gql`
  mutation ResendResetPasswordCode($email: String!) {
    resendResetPasswordCode(email: $email) {
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword(
    $email: String!
    $newPassword: String!
    $confirmNewPassword: String!
  ) {
    resetPassword(
      email: $email
      newPassword: $newPassword
      confirmNewPassword: $confirmNewPassword
    ) {
      message
    }
  }
`;
