/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import express from 'express';
import router from '@/src/routes/rest.routes';
import { authenticateJWT } from '@/src/middlewares/authenticateJwt.middleware';
import { roleSchema } from '@/src/graphql/schema/roles.schema';
import { userSchema } from '@/src/graphql/schema/users.schema';
import { getRoles } from '@/src/graphql/resolvers/getRoles.resolvers';
import { getAllUsers } from '@/src/graphql/resolvers/getAllUsers.resolvers';
import { graphqlHTTP } from 'express-graphql';

const app = express();

app.use(express.json());

app.use('/rest', router);

app.use(
  '/graphql/getRoles',
  authenticateJWT,
  graphqlHTTP((req) => ({
    schema: roleSchema,
    rootValue: getRoles,
    context: { req },
    graphiql: true,
  })),
);

app.use(
  '/graphql/getAllUsers',
  authenticateJWT,
  graphqlHTTP((req) => ({
    schema: userSchema,
    rootValue: getAllUsers,
    context: { req },
    graphiql: true,
  })),
);

export default app;
