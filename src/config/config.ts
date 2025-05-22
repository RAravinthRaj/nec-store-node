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

  nodeEnv: string;
  mongoURI: string;

  mailgunApiKey: string;
  mailgunDomain: string;
  mailgunClientUrl: string;

  jwtSecretKey: string;
  jwtExpiryTime: any;
  jwtSignInExpiryTime: any;
}

export const config: Config = {
  restPort: Number(process.env.REST_PORT) || 3000,
  graphqlPort: Number(process.env.GRAPHQL_PORT) || 3001,

  nodeEnv: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URL || '',

  mailgunApiKey: process.env.MAILGUN_API_KEY || '',
  mailgunDomain: process.env.MAILGUN_DOMAIN || '',
  mailgunClientUrl: process.env.MAILGUN_CLIENT_URL || '',

  jwtSecretKey: process.env.JWT_SECRET || '',
  jwtExpiryTime: process.env.JWT_EXPIRES_IN || ' ',
  jwtSignInExpiryTime: process.env.JWT_SIGN_IN_EXPIRES_IN || ' ',
};
