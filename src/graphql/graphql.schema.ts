/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { mergeTypeDefs } from '@graphql-tools/merge';

// TypeDefs
import {
  enumTypeDef,
  modelTypeDef,
  getRolesTypeDef,
  getAllUsersTypeDef,
  getUserTypeDef,
  updateUserTypeDef,
  getAccessTokenTypeDef,
  addCategoryTypeDef,
  getAllCategoriesTypeDef,
  addProductTypeDef,
  updateProductTypeDef,
  getAllProductsTypeDef,
  createOrderTypeDefs,
  cancelOrderTypeDef,
  updateOrderTypeDef,
  getAllOrdersTypeDef,
  getOrderTypeDef,
  getSalesTypeDef,
  getSalesReportTypeDef,
} from '@/src/graphql/typeDefs';

// Resolvers
import {
  getRoles,
  getAllUsers,
  getUser,
  updateUser,
  getAccessToken,
  addCategory,
  addProduct,
  updateProduct,
  getAllCategories,
  getAllProducts,
  createOrder,
  cancelOrder,
  updateOrder,
  getAllOrders,
  getOrder,
  getSales,
  getSalesReport,
} from '@/src/graphql/resolvers';

export const typeDefs = mergeTypeDefs([
  enumTypeDef,
  modelTypeDef,
  getRolesTypeDef,
  getAllUsersTypeDef,
  getUserTypeDef,
  updateUserTypeDef,
  getAccessTokenTypeDef,
  addCategoryTypeDef,
  addProductTypeDef,
  getAllCategoriesTypeDef,
  updateProductTypeDef,
  getAllProductsTypeDef,
  createOrderTypeDefs,
  cancelOrderTypeDef,
  updateOrderTypeDef,
  getAllOrdersTypeDef,
  getOrderTypeDef,
  getSalesTypeDef,
  getSalesReportTypeDef,
]);

export const resolvers = {
  Query: {
    getRoles,
    getAllUsers,
    getUser,
    getAccessToken,
    getAllCategories,
    getAllProducts,
    getAllOrders,
    getOrder,
    getSales,
    getSalesReport,
  },
  Mutation: {
    updateUser,
    addCategory,
    addProduct,
    updateProduct,
    createOrder,
    cancelOrder,
    updateOrder,
  },
};
