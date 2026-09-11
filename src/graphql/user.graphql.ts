import { gql, type TypedDocumentNode } from '@apollo/client';

import { type UserData } from '../types/user.type';

export const GET_USER: TypedDocumentNode<UserData, Record<string, never>> = gql`
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
