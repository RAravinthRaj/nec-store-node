/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/

import { Request } from 'express';
import User from '@/src/models/user.model';
import { Types } from 'mongoose';
import logger from '@/src/utils/logger';

interface Context {
  req: Request;
}

interface AddRecentArgs {
  userId: string;
  productId: string;
}

export const addRecent = async (_: any, { userId, productId }: AddRecentArgs, context: Context) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.recents) user.recents = [];

    const productObjectId = new Types.ObjectId(productId);
    user.recents = user.recents.filter((id) => id.toString() !== productId);
    user.recents.unshift(productObjectId);

    if (user.recents.length > 10) {
      user.recents = user.recents.slice(0, 10);
    }

    await user.save();
    return user;
  } catch (err: any) {
    const error = err?.message || err?.toString?.() || 'Unknown error';
    logger.error(`Error in addRecent: ${error}`);
    throw new Error(error);
  }
};
