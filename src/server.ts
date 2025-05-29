/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import 'module-alias/register';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { authenticateJWT } from '@/src/middlewares/authenticateJwt.middleware';
import { accessControl } from '@/src/middlewares/accessControl.middleware';
import { resolvers, typeDefs } from '@/src/graphql/graphql.schema';
import router from '@/src/routes/rest.route';
import { config } from '@/src/config/config';
import logger from '@/src/utils/logger';
import { startReportWorker } from '@/src/workers/report.worker';

const app = express();
app.use(cors());
app.use(express.json());

async function startRestServer() {
  app.use('/rest', router);

  app.listen(config.restPort, () => {
    logger.info(`🚀 REST Server running at http://localhost:${config.restPort}/rest`);
  });
}

async function startGraphqlServer() {
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: config.nodeEnv === 'development',
    plugins: [
      config.nodeEnv === 'development'
        ? ApolloServerPluginLandingPageLocalDefault({ embed: true })
        : ApolloServerPluginLandingPageDisabled(),
    ],
    formatError: (formattedError) => {
      return {
        message: formattedError.message,
        path: formattedError.path,
        locations: formattedError.locations,
        extensions: {
          code: formattedError.extensions?.code,
        },
      };
    },
  });

  await graphqlServer.start();
  app.use(bodyParser.json());

  app.use(
    '/graphql',
    authenticateJWT,
    accessControl,
    expressMiddleware(graphqlServer, {
      context: async ({ req }) => ({ req }),
    }),
  );

  app.listen(config.graphqlPort, () => {
    logger.info(`🚀 GRAPHQL Server running at http://localhost:${config.graphqlPort}/graphql`);
  });
}

async function connectRedisAndStartWorker() {
  startReportWorker();
  logger.info(
    `🚀 Connected to REDIS Server running at http://${config.redisHost}:${config.redisPort}`,
  );
}

mongoose
  .connect(String(config.mongoURI))
  .then(() => {
    logger.info('Database connected successfully');
    startRestServer();
    startGraphqlServer();
    connectRedisAndStartWorker();
  })
  .catch((err) => {
    logger.error(`Error occurred: ${err}`);
  });
