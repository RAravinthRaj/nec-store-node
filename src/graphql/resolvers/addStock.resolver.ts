/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import Product from '@/src/models/product.model';
import { Role } from '@/src/config/enum.config';
import logger from '@/src/utils/logger';

interface Context {
  req: Request;
}

interface AddStockInput {
  id: string;
  quantity?: number;
  price?: number;
}

export const addStock = async (_: any, args: { input: AddStockInput }, context: Context) => {
  try {
    const currentRole = (context.req as any)?.user?.role;
    if (!currentRole) {
      throw new Error('Unauthorized: No token provided.');
    }

    if (currentRole !== Role.Retailer) {
      throw new Error("You don't have enough permission to perform this operation.");
    }

    const { id, quantity, price } = args.input;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found.');
    }

    if ((quantity !== undefined && quantity <= 0) || (price !== undefined && price <= 0)) {
      throw new Error('Quantity or price must be non-negative');
    }

    if (price !== undefined && quantity !== undefined) {
      const totalQuantity = existingProduct.quantity + quantity;
      existingProduct.price =
        (existingProduct.quantity * existingProduct.price + quantity * price) / totalQuantity;
      existingProduct.quantity = totalQuantity;
    }

    await existingProduct.save();

    return {
      message: 'Stock Added successfully.',
      product: existingProduct,
    };
  } catch (err: any) {
    logger.error(`Error in addStockProduct: ${err.message || err}`);
    throw err;
  }
};
