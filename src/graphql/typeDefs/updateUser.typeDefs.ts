import gql from 'graphql-tag';

export const updateUserTypeDefs = gql`
  enum UserStatus {
    active
    suspended
  }

  input UpdateUserInput {
    email: String
    name: String
    rollNumber: String
    department: String
    profilePicture: String
    roles: [String!]
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
