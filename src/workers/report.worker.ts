/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { ConnectionOptions } from 'bullmq';
import { Worker } from 'bullmq';
import { MailService } from '@/src/services/mail.service';
import ExcelJS from 'exceljs';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { config } from '@/src/config/config';
import logger from '@/src/utils/logger';

export const redisConnection: ConnectionOptions = {
  host: config.redisHost,
  port: config.redisPort,
  username: config.redisUserName || undefined,
  password: config.redisPassword || undefined,
  db: config.redisDBType,
};

export function startReportWorker() {
  try {
    const worker = new Worker(
      'report-queue',
      async (job: any) => {
        const { userEmail, userName, reportData, startDate, endDate } = job.data;

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sales Report');

        sheet.columns = [
          { header: 'Category', key: 'category', width: 25 },
          { header: 'Title', key: 'title', width: 30 },
          { header: 'Sold', key: 'sold', width: 15 },
          { header: 'Left', key: 'left', width: 15 },
          { header: 'Total Amount', key: 'totalAmount', width: 20 },
        ];

        if (!reportData?.items || reportData?.items.length == 0) {
          throw new Error('Requested report not found.');
        }

        reportData?.items.forEach((item: any) => {
          sheet.addRow({
            category: item.category?.name || 'N/A',
            title: item.title || '',
            sold: item.sold ?? 0,
            left: item.left ?? 0,
            totalAmount: item.totalPrice ?? 0,
          });
        });

        const filePath = path.join(os.tmpdir(), `sales-${Date.now()}.xlsx`);
        await workbook.xlsx.writeFile(filePath);

        logger.info(startDate + ' ' + endDate);

        await MailService.getInstance().sendReport({
          email: userEmail,
          userName,
          startDate,
          endDate,
          attachmentPath: filePath,
        });

        await fs.unlink(filePath);
      },
      {
        connection: redisConnection,
      },
    );

    worker.on('completed', (job) => {
      logger.info(`Job ${job.id} completed successfully.`);
    });

    worker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} failed: ${err.message}`);
    });

    worker.on('progress', (job, progress) => {
      logger.info(`Job ${job.id} progress: ${progress}%`);
    });

    worker.on('error', (err) => {
      logger.error(`Worker error: ${err.message}`);
    });
  } catch (err: any) {
    logger.error('Error in startReportWorker:', err);
    throw err;
  }
}
