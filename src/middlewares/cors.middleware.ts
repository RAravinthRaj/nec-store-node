/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/

import { config } from '@/src/config/config';
import cors from 'cors';
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [config.frontendURL, 'https://nec-store-react.onrender.com', 'http://localhost:5173'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true,
});
