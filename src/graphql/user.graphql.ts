import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser {
    viewer {
      email
      name
      userId
      username
      userrole
      userInformation {
        designation
      }
      avatar {
        height
        url
        width
      }
    }
  }
`;
