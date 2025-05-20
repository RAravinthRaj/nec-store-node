/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
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
      return res.status(400).json({ error: 'Invalid email.' });
    }

    const user = await User.findOne({ email });
    const otpStore = OtpStore.getInstance();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (otpStore.has(email)) {
      const retrievedOtp = otpStore.get(email);

      logger.info('OTP already exists');

      await MailService.getInstance().sendOTP({
        email: user.email,
        userName: user.name,
        otp: retrievedOtp || '',
      });

      return res.status(200).json({ message: 'OTP sent successfully.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    await MailService.getInstance().sendOTP({
      email: user.email,
      userName: user.name,
      otp,
    });

    return res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (err) {
    logger.error(`Error in SignIn : ${err}`);
    next(err);
  }
};
