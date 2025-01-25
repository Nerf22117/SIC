import { gql } from "@apollo/client";

// -------------------------------
// Authentication Mutations
// -------------------------------

/**
 * Sign Up a new user
 * @param {SignUpInput} input - Input object containing user details for signup
 */
export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      message
    }
  }
`;

/**
 * Verify user account
 * @param {String} email - Email of the user
 * @param {String} verificationCode - Verification code sent to email
 */
export const VERIFY_ACCOUNT = gql`
  mutation VerifyAccount($email: String!, $verificationCode: String!) {
    verifyAccount(email: $email, verificationCode: $verificationCode) {
      _id
      username
      name
    }
  }
`;

/**
 * Resend verification code to the user
 * @param {String} email - Email of the user
 */
export const RESEND_VERIFICATION_CODE = gql`
  mutation ResendVerificationCode($email: String!) {
    resendVerificationCode(email: $email) {
      message
    }
  }
`;

/**
 * Sign in a user
 * @param {SignInInput} input - Input object containing credentials
 */
export const Sign_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      _id
      name
      isVerified
    }
  }
`;

/**
 * Logout the current user
 */
export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

// -------------------------------
// Password Recovery Mutations
// -------------------------------

/**
 * Request password reset email
 * @param {String} email - Email of the user
 */
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
    }
  }
`;

/**
 * Validate the password reset code
 * @param {String} email - Email of the user
 * @param {String} resetPasswordCode - Reset code sent to email
 */
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

/**
 * Resend reset password code
 * @param {String} email - Email of the user
 */
export const RESEND_RESET_PASSWORD_CODE = gql`
  mutation ResendResetPasswordCode($email: String!) {
    resendResetPasswordCode(email: $email) {
      message
    }
  }
`;

/**
 * Reset the user's password
 * @param {String} email - Email of the user
 * @param {String} newPassword - New password to set
 * @param {String} confirmNewPassword - Confirmation of the new password
 */
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
