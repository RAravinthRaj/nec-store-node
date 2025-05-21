/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  nodeEnv: string;
  mongoURI: string;

  mailgunApiKey: string;
  mailgunDomain: string;
  mailgunClientUrl: string;

  jwtSecretKey: string;
  jwtExpiryTime: any;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URL || '',

  mailgunApiKey: process.env.MAILGUN_API_KEY || '',
  mailgunDomain: process.env.MAILGUN_DOMAIN || '',
  mailgunClientUrl: process.env.MAILGUN_CLIENTURL || '',

  jwtSecretKey: process.env.JWT_SECRET || '',
  jwtExpiryTime: process.env.JWT_EXPIRES_IN || ' ',
};
