/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import User from '@/src/models/user.model';
import OtpStore from '@/src/services/otpStore';
import { CustomRequestHandler } from '@/types/express';
import JwtService from '@/src/services/jwtService';
import logger from '@/src/utils/logger';

export const verifyOtp: CustomRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp }: any = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.toLowerCase().trim() : value,
      ]),
    );

    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email.' });
    }

    if (validator.isEmpty(otp)) {
      return res.status(400).json({ error: 'OTP is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const otpStore = OtpStore.getInstance();
    const entry = otpStore.get(email);

    if (!entry) {
      return res.status(400).json({ error: 'OTP has expired.' });
    }

    if (entry !== otp) {
      return res.status(401).json({ error: 'Invalid OTP.' });
    }

    otpStore.delete(email);

    const jwtInstance = JwtService.getInstance();
    const token = jwtInstance.generateToken({
      email: user.email,
      userName: user.name,
      rollNumber: user.rollNumber,
      department: user.department,
    });

    return res.status(200).json({ message: 'OTP verified successfully.', accessToken: token });
  } catch (err) {
    logger.error(`Error in OTP verification: ${err}`);
    next(err);
  }
};
