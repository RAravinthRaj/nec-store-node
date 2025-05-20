import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import config from '@/src/config/config';
import logger from '../utils/logger';

export interface SendOTPParams {
  email: string;
  name: string;
  otp: string;
}

export interface IMailService {
  sendOTP(args: SendOTPParams): Promise<any>;
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
      const { email, name, otp } = args;

      const result = await this.mg.messages.create(config.mailgunDomain, {
        from: `NEC Store <postmaster@${config.mailgunDomain}>`,
        to: [`${name} <${email}>`],
        subject: 'OTP Verification Code',
        template: 'otp-sender',
        'h:X-Mailgun-Variables': JSON.stringify({ userName: name, OTP: otp }),
      });

      logger.info(`Email Sent Successfully ${email} - ${otp}`);

      return result;
    } catch (error) {
      logger.error('Mailgun Error:', error);
      throw error;
    }
  }
}

export default MailService;
