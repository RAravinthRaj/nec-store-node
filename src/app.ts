/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import express from 'express';
import UserRouter from '@/src/routes/user.routes';
import AuthRouter from '@/src/routes/auth.routes';
import VerifyRouter from '@/src/routes/verify.routes';
import { errorHandler } from '@/src/middlewares/errorHandler';

const app = express();
app.use(express.json());

app.use('/users', UserRouter);
app.use('/users', AuthRouter);
app.use('/users', VerifyRouter);

app.use(errorHandler);

export default app;
