import { gql, type TypedDocumentNode } from '@apollo/client';

export interface LoginResult {
  login: {
    tempToken: string;
    message: string;
  };
}

export interface LoginVariables {
  username: string;
  password: string;
}

export const LOGIN_MUTATION: TypedDocumentNode<LoginResult, LoginVariables> = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      tempToken
      message
    }
  }
`;

export interface VerifyOtpResult {
  verifyOtp: {
    success: boolean;
    token: string | null;
    refreshToken: string | null;
    message: string;
  };
}

export interface VerifyOtpVariables {
  tempToken: string;
  otp: string;
}

export const VERIFY_OTP_MUTATION: TypedDocumentNode<VerifyOtpResult, VerifyOtpVariables> = gql`
  mutation VerifyOtp($tempToken: String!, $otp: String!) {
    verifyOtp(input: { tempToken: $tempToken, otp: $otp }) {
      success
      token
      refreshToken
      message
    }
  }
`;
