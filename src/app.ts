/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import express from 'express';
import router from '@/src/routes/rest.routes';
import { errorHandler } from '@/src/middlewares/errorHandler.middleware';

const app = express();
app.use(express.json());

app.use('/users', router);

app.use(errorHandler);

export default app;
