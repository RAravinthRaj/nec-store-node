/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { ConnectionOptions, Worker, Job, JobProgress } from 'bullmq';
// import { MailService } from '@/src/services/mail.service';
import ExcelJS from 'exceljs';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { config } from '@/src/config/config';
import logger from '@/src/utils/logger';
import { createClient } from 'redis';

// Define types for job data
interface ReportJobData {
  userEmail: string;
  userName: string;
  reportData: {
    items: Array<{
      category?: { name?: string };
      title?: string;
      sold?: number;
      left?: number;
      totalPrice?: number;
    }>;
  };
  startDate: string;
  endDate: string;
}

export const redisConnection: ConnectionOptions = {
  url: config.redisUrl,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
};

export async function testRedisConnection(): Promise<void> {
  try {
    const client = createClient({ url: config.redisUrl });
    client.on('error', (err: Error) => logger.error(`Redis Client Error: ${err.message}`));
    await client.connect();
    await client.ping();
    logger.info('✅ Successfully connected to Redis');
    await client.disconnect();
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown Redis connection error');
    logger.error(`Failed to connect to Redis: ${error.message}`);
    throw error;
  }
}

export function startReportWorker(): void {
  try {
    testRedisConnection()
      .then(() => {
        const worker = new Worker<ReportJobData>(
          'report-queue',
          async (job: Job<ReportJobData>) => {
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

            if (!reportData?.items || reportData.items.length === 0) {
              throw new Error('Requested report not found.');
            }

            reportData.items.forEach((item) => {
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

            logger.info(`Generated report for ${startDate} to ${endDate}`);

            // await MailService.getInstance().sendReport({
            //   email: userEmail,
            //   userName,
            //   startDate,
            //   endDate,
            //   attachmentPath: filePath,
            // });

            await fs.unlink(filePath);
            logger.info(`Temporary file ${filePath} deleted`);
          },
          {
            connection: redisConnection,
            concurrency: 5,
            limiter: {
              max: 100,
              duration: 60 * 1000,
            },
          },
        );

        worker.on('completed', (job: Job<ReportJobData>) => {
          logger.info(`Job ${job.id} completed successfully.`);
        });

        worker.on('failed', (job: Job<ReportJobData> | undefined, err: Error) => {
          logger.error(`Job ${job?.id ?? 'unknown'} failed: ${err.message}`);
        });

        worker.on('progress', (job: Job<ReportJobData>, progress: JobProgress) => {
          logger.info(
            `Job ${job.id} progress: ${
              typeof progress === 'number' ? `${progress}%` : JSON.stringify(progress)
            }`,
          );
        });

        worker.on('error', (err: Error) => {
          logger.error(`Worker error: ${err.message}`);
        });

        logger.info('📊 Report worker started with remote Redis');
      })
      .catch((err: Error) => {
        logger.error(`Failed to start report worker: ${err.message}`);
        throw err;
      });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown error in startReportWorker');
    logger.error(`Error in startReportWorker: ${error.message}`);
    throw error;
  }
}
