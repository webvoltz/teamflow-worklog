import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      tempToken
      message
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($tempToken: String!, $otp: String!) {
    verifyOtp(input: { tempToken: $tempToken, otp: $otp }) {
      success
      token
      refreshToken
      message
    }
  }
`;
