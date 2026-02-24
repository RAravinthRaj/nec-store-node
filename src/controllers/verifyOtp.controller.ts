/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/

import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import User from '@/src/models/user.model';
import { OtpStore } from '@/src/services/otpStore.service';
import { CustomRequestHandler } from '@/types/express';
import { JwtService } from '@/src/services/jwt.service';
import logger from '@/src/utils/logger';

export const verifyOtp: CustomRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body as { email: string; otp: string };

    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email.' });
    }

    if (!otp || validator.isEmpty(String(otp))) {
      return res.status(400).json({ error: 'OTP is required.' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const otpStore = OtpStore.getInstance();
    const storedOtp = await otpStore.get(normalizedEmail);

    if (!storedOtp) {
      return res.status(400).json({ error: 'OTP has expired.' });
    }

    if (String(storedOtp) !== String(otp)) {
      return res.status(401).json({ error: 'Invalid OTP.' });
    }

    await otpStore.delete(normalizedEmail);

    const signInToken = JwtService.getInstance().generateToken(
      {
        id: user.id,
        email: user.email,
        userName: user.name,
        rollNumber: user.rollNumber,
        department: user.department,
      },
      true,
    );

    return res.status(200).json({
      message: 'OTP verified successfully.',
      signInToken,
    });
  } catch (err: any) {
    logger.error(`Error in verifyOtp: ${err}`);
    next(err);
  }
};
