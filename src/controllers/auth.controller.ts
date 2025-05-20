import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import User from '@/src/models/user.model';
import MailService from '@/src/services/mailService';
import OtpStore from '@/src/services/otpStore';
import { CustomRequestHandler } from '@/types/express';
import logger from '@/src/utils/logger';

export const signIn: CustomRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email }: any = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.toLowerCase().trim() : value,
      ]),
    );

    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    const user = await User.findOne({ email });
    const otpStore = OtpStore.getInstance();

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up.' });
    }

    if (otpStore.has(email)) {
      const retrievedOtp = otpStore.get(email);
      logger.info('OTP already exists ' + email + retrievedOtp);
      return res.status(200).json({ message: 'OTP has already sent to your mail.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    await MailService.getInstance().sendOTP({
      email: user.email,
      name: user.name,
      otp,
    });

    return res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (err) {
    logger.error(`SignIn Error: ${err}`);
    next(err);
  }
};
