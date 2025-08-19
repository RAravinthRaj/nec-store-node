/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import Order from '@/src/models/order.model';
import User from '@/src/models/user.model';
import logger from '@/src/utils/logger';
import mongoose from 'mongoose';

interface Context {
  req: any;
}

interface GetAllOrdersArgs {
  skip?: number;
  limit?: number;
  orderId?: string;
  userId?: string;
  rollNumber?: string;
  orderBy?: 'ASC' | 'DESC';
}

export const getAllOrders = async (_: any, args: GetAllOrdersArgs, context: Context) => {
  try {
    const user = (context.req as any).user;
    if (!user?.role) {
      throw new Error('Unauthorized: No token provided.');
    }

    const { skip = 0, limit = 10, orderId, userId, rollNumber, orderBy = 'ASC' } = args;

    const filter: Record<string, any> = {};

    filter.orderStatus = { $ne: 'cancelled' };

    if (orderId?.trim()) {
      filter.orderId = { $regex: `^${orderId.trim()}`, $options: 'i' };
    }

    if (userId?.trim()) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(userId.trim());
      if (isValidObjectId) {
        filter['orderBy'] = new mongoose.Types.ObjectId(userId.trim());
      } else {
        throw new Error('Invalid userId');
      }
    }

    if (rollNumber?.trim()) {
      const matchedUsers = await User.find({
        rollNumber: { $regex: `^${rollNumber.trim()}`, $options: 'i' },
      });

      if (!matchedUsers.length) throw new Error('No users found with given rollNumber start');
      filter['orderBy'] = matchedUsers.map((user) => user._id);
    }

    const sortOrder = orderBy === 'DESC' ? -1 : 1;

    const orders = await Order.find(filter)
      .sort({ orderId: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('orderBy');

    const totalCount = await Order.countDocuments(filter);

    return { orders, totalCount };
  } catch (err: any) {
    logger.error(`Error in getAllOrders: ${err.message || err}`);
    throw new Error('Failed to fetch orders');
  }
};
