/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { config } from '@/src/config/config';
import logger from '@/src/utils/logger';
import fs from 'fs';

export interface SendOTPParams {
  email: string;
  userName: string;
  otp: string;
}
export interface SendReportParams {
  email: string;
  userName: string;
  startDate: string;
  endDate: string;
  attachmentPath: string;
}

export interface IMailService {
  sendOTP(args: SendOTPParams): Promise<any>;
  sendReport(args: SendReportParams): Promise<any>;
}

export class MailService implements IMailService {
  private static instance: MailService;
  private mg: ReturnType<Mailgun['client']>;

  private constructor() {
    const mailgun = new Mailgun(FormData);
    this.mg = mailgun.client({
      username: 'api',
      key: config.mailgunApiKey,
      url: config.mailgunClientUrl,
    });
  }

  public static getInstance(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }

    return MailService.instance;
  }

  public async sendOTP(args: SendOTPParams) {
    try {
      const { email, userName, otp } = args;

      const result = await this.mg.messages.create(config.mailgunDomain, {
        from: `NEC Store <postmaster@${config.mailgunDomain}>`,
        to: [`${userName} <${email}>`],
        subject: 'OTP Verification Code',
        template: 'otp-sender',
        'h:X-Mailgun-Variables': JSON.stringify({ userName, OTP: otp }),
      });

      logger.info(`Email Sent Successfully to ${email} - ${otp}`);
      return result;
    } catch (err: any) {
      logger.error('Error in sendOTP:', err);
      throw err;
    }
  }

  public async sendReport(args: SendReportParams) {
    try {
      const { email, userName, startDate, endDate, attachmentPath } = args;

      const result = await this.mg.messages.create(config.mailgunDomain, {
        from: `NEC Store <postmaster@${config.mailgunDomain}>`,
        to: [`${userName} <${email}>`],
        subject: 'Sales Report',
        template: 'report-sender',
        'h:X-Mailgun-Variables': JSON.stringify({
          userName,
          startDate,
          endDate,
        }),
        attachment: [
          {
            filename: 'sales-report.xlsx',
            data: fs.createReadStream(attachmentPath),
          },
        ],
      });

      logger.info(`Report Sent Successfully to ${email} - ${startDate} to ${endDate}`);
      return result;
    } catch (err: any) {
      logger.error('Error in sendReport:', err);
      throw err;
    }
  }
}
