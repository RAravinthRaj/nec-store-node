/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { buildSchema } from 'graphql';

export const userSchema = buildSchema(`
  enum OrderBy {
    ASC
    DESC
  }

  type User {
    email: String!
    rollNumber: String!
    name: String!
    roles: [String!]
  }

  type Query {
    getAllUsers(
      name: String
      email: String
      skip: Int
      limit: Int
      orderBy: OrderBy
    ): [User!]!
  }
`);
