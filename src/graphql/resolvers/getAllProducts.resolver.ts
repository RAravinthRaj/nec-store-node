/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import Product from '@/src/models/product.model';
import logger from '@/src/utils/logger';

interface Context {
  req: any;
}

interface GetAllProductsArgs {
  skip?: number;
  limit?: number;
  orderBy?: 'ASC' | 'DESC';
  categoryId?: string;
  title?: string;
  productIds?: string[];
}

export const getAllProducts = async (_: any, args: GetAllProductsArgs, context: Context) => {
  try {
    const { skip = 0, limit = 10, orderBy = 'ASC', categoryId, title, productIds } = args;

    const filter: Record<string, any> = {};

    if (productIds?.length) {
      filter._id = { $in: productIds };
    }
    if (categoryId) {
      filter['category._id'] = categoryId;
    }
    if (title?.trim()) {
      filter.title = { $regex: title.trim(), $options: 'i' };
    }

    const sortOrder = orderBy === 'DESC' ? -1 : 1;

    const products = await Product.find(filter).sort({ title: sortOrder }).skip(skip).limit(limit);

    const totalCount = await Product.countDocuments(filter);

    return { products, totalCount };
  } catch (err: any) {
    logger.error(`Error in getAllProducts: ${err.message || err}`);
    throw err;
  }
};
