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
    department: String!
    roles: [String!]
    profilePicture: String
    status: String
  }

  type Query {
    getUser(email: String): User!
  }
`;
