/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  restPort: number;
  graphqlPort: number;

  frontendURL: string;

  nodeEnv: string;
  mongoURI: string;

  smtpUserName: string;
  smtpPassword: string;

  jwtSecretKey: string;
  jwtExpiryTime: any;
  jwtSignInExpiryTime: any;

  redisUrl: string;

  imageApiKey: string;

  rateLimitMinutes: number;
  rateLimitRequests: number;

  sendGridApiKey: string;
}

export const config: Config = {
  restPort: Number(process.env.REST_PORT) || 3000,
  graphqlPort: Number(process.env.GRAPHQL_PORT) || 3001,

  frontendURL: process.env.FRONTEND_URL?.trim() || 'http://localhost:5174',

  nodeEnv: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URL || '',

  smtpUserName: process.env.SMTP_USER_NAME || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',

  jwtSecretKey: process.env.JWT_SECRET || '',
  jwtExpiryTime: process.env.JWT_EXPIRES_IN || ' ',
  jwtSignInExpiryTime: process.env.JWT_SIGN_IN_EXPIRES_IN || ' ',

  redisUrl: process.env.REDIS_URL || 'http://localhost:6379',

  imageApiKey: process.env.IMG_BB_API_KEY || '',

  rateLimitMinutes: Number(process.env.RATE_LIMIT_MINUTES) || 15,
  rateLimitRequests: Number(process.env.RATE_LIMIT_MAX_REQUEST) || 100,

  sendGridApiKey: process.env.SEND_GRID_API_KEY || '',
};
