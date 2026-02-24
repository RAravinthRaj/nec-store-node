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

  imageApiKey: string;

  rateLimitMinutes: number;
  rateLimitRequests: number;

  // redisOtpUrl: string;
  // redisOtpToken: string;

  redisHost: string;
  redisPort: number;
  redisUserName: string;
  redisPassword: string;
  redisDBType: number;

  threshold: number;
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

  imageApiKey: process.env.IMG_BB_API_KEY || '',

  rateLimitMinutes: Number(process.env.RATE_LIMIT_MINUTES) || 15,
  rateLimitRequests: Number(process.env.RATE_LIMIT_MAX_REQUEST) || 100,

  redisHost: process.env.REDIS_HOST || '',
  redisPort: Number(process.env.REDIS_PORT) || 3002,
  redisUserName: process.env.REDIS_USERNAME || '',
  redisPassword: process.env.REDIS_PASSWORD || '',
  redisDBType: Number(process.env.REDIS_DB) || 0,

  threshold: 10,
};
