/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import gql from 'graphql-tag';

export const getUserTypeDefs = gql`
  type User {
    email: String!
    rollNumber: String!
    name: String!
    department: Department!
    roles: [Role!]
    profilePicture: String
    status: UserStatus
  }

  type Query {
    getUser(id: ID!): User!
  }
`;
