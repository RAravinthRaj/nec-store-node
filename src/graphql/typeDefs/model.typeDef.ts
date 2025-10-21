/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import gql from 'graphql-tag';

export const modelTypeDef = gql`
  type User {
    id: ID!
    email: String!
    rollNumber: String!
    name: String!
    roles: [Role!]
    department: Department!
    profilePicture: String
    status: UserStatus!
    recents: [ID!]!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: ID!
    title: String!
    category: Category!
    quantity: Int!
    price: String!
    productImage: String
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: ID!
    orderBy: ID!
    orderId: String!
    rollNumber: String!
    products: [Product!]!
    totalAmount: Float!
    deliveryStatus: DeliveryStatus!
    paidStatus: PaidStatus!
    orderStatus: OrderStatus!
    createdAt: String!
    updatedAt: String!
  }

  type SalesItem {
    title: String!
    category: Category!
    left: Int!
    sold: Int!
    totalPrice: Float!
    productImage: String
    createdAt: String!
    updatedAt: String!
  }
`;
