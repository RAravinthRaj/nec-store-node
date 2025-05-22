/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { mergeTypeDefs } from '@graphql-tools/merge';

// TypeDefs
import {
  roleTypeDefs,
  userTypeDefs,
  getUserTypeDefs,
  updateUserTypeDefs,
  accessTokenTypeDefs,
  enumTypeDefs,
} from '@/src/graphql/typeDefs';

// Resolvers
import {
  getRoles,
  getAllUsers,
  getUser,
  updateUser,
  getAccessToken,
} from '@/src/graphql/resolvers';

export const typeDefs = mergeTypeDefs([
  enumTypeDefs,
  roleTypeDefs,
  userTypeDefs,
  getUserTypeDefs,
  updateUserTypeDefs,
  accessTokenTypeDefs,
]);
export const resolvers = {
  Query: {
    getRoles,
    getAllUsers,
    getUser,
    getAccessToken,
  },
  Mutation: {
    updateUser,
  },
};
