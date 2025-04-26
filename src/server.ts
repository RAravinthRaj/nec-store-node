/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import 'module-alias/register';
import mongoose from 'mongoose';
import logger from '@/src/utils/logger';
import app from '@/src/app';
import config from '@/src/config/config';

mongoose
  .connect(String(config.mongoURI))
  .then(() => {
    logger.info('Database connected successfully');
    app.listen(config.port, () => {
      logger.info(`Server running at ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error(`Error occurred: ${err}`);
  });
