/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import mongoose from 'mongoose';
import Order from '@/src/models/order.model';
import logger from '@/src/utils/logger';
import { Role } from '@/src/config/enum.config';

export interface GetSalesContext {
  req: Request;
}

interface GetSalesInput {
  from?: string;
  to?: string;
  categoryId?: string;
  title?: string;
  skip?: number;
  limit?: number;
}

interface GetSalesArgs {
  input: GetSalesInput;
}

export const getSales = async (_: any, { input }: GetSalesArgs, context: GetSalesContext) => {
  try {
    const currentRole = (context.req as any).user?.role;
    if (!currentRole) {
      throw new Error('Unauthorized: No token provided.');
    }

    if (currentRole !== Role.Retailer) {
      throw new Error("You don't have permission to perform this operation.");
    }

    const { from, to, categoryId, title, skip = 0, limit } = input || {};

    const pipeline: any[] = [];

    if (from || to) {
      const createdAt: any = {};
      if (from) createdAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        createdAt.$lte = toDate;
      }
      pipeline.push({ $match: { createdAt } });
    }

    pipeline.push({ $unwind: '$products' });

    const productMatch: any = {};
    if (categoryId) productMatch['products.category._id'] = new mongoose.Types.ObjectId(categoryId);
    if (title) productMatch['products.title'] = { $regex: title, $options: 'i' };
    if (Object.keys(productMatch).length) pipeline.push({ $match: productMatch });

    // Group by product _id to aggregate total sold and total price per product across orders
    pipeline.push({
      $group: {
        _id: '$products._id',
        sold: { $sum: '$products.quantity' },
        totalPrice: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
      },
    });

    pipeline.push(
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
    );

    pipeline.push({
      $project: {
        title: '$productDetails.title',
        productImage: '$productDetails.productImage',
        left: '$productDetails.quantity',
        sold: 1,
        totalPrice: 1, // use aggregated totalPrice from group
        createdAt: { $toString: '$productDetails.createdAt' },
        updatedAt: { $toString: '$productDetails.updatedAt' },
        category: {
          id: '$productDetails.category._id',
          name: '$productDetails.category.name',
          createdAt: { $toString: '$productDetails.category.createdAt' },
          updatedAt: { $toString: '$productDetails.category.updatedAt' },
        },
      },
    });

    pipeline.push({ $sort: { 'category.name': 1, title: 1 } });

    pipeline.push({
      $facet: {
        paginatedResults: limit ? [{ $skip: skip }, { $limit: limit }] : [{ $skip: skip }],
        totalData: [
          {
            $group: {
              _id: null,
              totalSold: { $sum: '$sold' },
              totalAmount: { $sum: '$totalPrice' }, // sum of totalPrice of all products
            },
          },
        ],
      },
    });

    const [result] = await Order.aggregate(pipeline);

    const items = result?.paginatedResults ?? [];
    const totals = result?.totalData?.[0] ?? {
      totalSold: 0,
      totalAmount: 0,
    };

    return {
      items,
      totalSold: totals.totalSold,
      totalAmount: totals.totalAmount,
    };
  } catch (error: any) {
    logger.error(`Error in getSales: ${error.message || error}`);
    throw error;
  }
};
