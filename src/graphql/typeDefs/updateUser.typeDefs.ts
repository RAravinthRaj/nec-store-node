import gql from 'graphql-tag';

export const updateUserTypeDefs = gql`
  input UpdateUserInput {
    id: ID!
    email: String
    name: String
    rollNumber: String
    department: Department
    profilePicture: String
    roles: [Role!]
    status: UserStatus
  }

  type UpdateUserResponse {
    success: Boolean!
    message: String!
    token: String
  }

  type Mutation {
    updateUser(input: UpdateUserInput!): UpdateUserResponse!
  }
`;
