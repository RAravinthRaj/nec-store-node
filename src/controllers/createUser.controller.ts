/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { NextFunction, Request, Response } from 'express';
import { CustomRequestHandler } from '@/types/express';
import User from '@/src/models/user.model';
import validator from 'validator';
import { Department } from '@/src/config/enum.config';
import logger from '@/src/utils/logger';

export const createUser: CustomRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rollNumber, name, department, email }: any = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ]),
    );

    if (
      validator.isEmpty(rollNumber) ||
      validator.isEmpty(name) ||
      validator.isEmpty(department) ||
      (validator.isEmpty(email) && !validator.isEmail(email))
    ) {
      return res.status(400).json({ error: 'All fields must be non-empty.' });
    }

    const user = new User({
      rollNumber: rollNumber,
      name: name,
      department: Department[department.toUpperCase() as keyof typeof Department],
      email: email.toLowerCase(),
    });

    const savedUser = await user.save();

    return res.status(201).json(savedUser);
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err?.keyPattern)[0];
      logger.error(`Error Code: ${400} -> ${field} already exists.`);

      return res.status(400).json({ error: `${field} already exists.` });
    }

    next(err);
  }
};
