/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import User from '@/src/models/user.model';
import logger from '@/src/utils/logger';

interface Context {
  req: Request;
}

interface GetAllRecentProductsArgs {
  userId: string;
}

export const getAllRecentProducts = async (
  _: any,
  { userId }: GetAllRecentProductsArgs,
  context: Context,
) => {
  try {
    const user = await User.findById(userId).lean();
    if (!user) throw new Error('User not found');

    return user.recents || [];
  } catch (err: any) {
    const error = err?.message || err?.toString?.() || 'Unknown error';
    logger.error(`Error in getAllRecentProductIds: ${error}`);
    throw new Error(error);
  }
};
