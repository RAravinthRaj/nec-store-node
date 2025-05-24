/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Role } from '@/src/config/enum.config';
import Order from '@/src/models/order.model';
import logger from '@/src/utils/logger';

interface Context {
  req: any;
}

interface GetAllOrdersArgs {
  skip?: number;
  limit?: number;
  orderId?: string;
  userId?: string;
  orderBy?: 'ASC' | 'DESC';
}

export const getAllOrders = async (_: any, args: GetAllOrdersArgs, context: Context) => {
  try {
    const currentRole = (context.req as any).user?.role;
    if (!currentRole) {
      throw new Error('Unauthorized: No token provided.');
    }

    if (currentRole !== Role.Retailer) {
      throw new Error("You don't have permission to perform this operation.");
    }

    const { skip = 0, limit = 10, orderId, userId, orderBy = 'ASC' } = args;

    const filter: Record<string, any> = {};

    if (orderId?.trim()) {
      filter.orderId = { $regex: `^${orderId.trim()}`, $options: 'i' };
    }

    if (userId?.trim()) {
      filter['orderBy.rollNumber'] = { $regex: `^${userId.trim()}`, $options: 'i' };
    }

    const sortOrder = orderBy === 'DESC' ? -1 : 1;

    const orders = await Order.find(filter).sort({ orderId: sortOrder }).skip(skip).limit(limit);

    return orders;
  } catch (err: any) {
    logger.error(`Error in getAllOrders: ${err.message || err}`);
    throw err;
  }
};
