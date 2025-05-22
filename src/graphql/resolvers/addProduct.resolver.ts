/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import mongoose from 'mongoose';
import Product from '@/src/models/product.model';
import CategoryModel from '@/src/models/category.model';
import { Role } from '@/src/config/enum.config';
import logger from '@/src/utils/logger';

interface Context {
  req: Request;
}

interface AddProductArgs {
  title: string;
  category: string;
  quantity: number;
  price: string;
  productImage?: string;
}

export const addProduct = async (_: any, args: AddProductArgs, context: Context) => {
  try {
    const currentRole = (context.req as any)?.user?.role;
    if (!currentRole) {
      throw new Error('Unauthorized: No token provided.');
    }

    if (currentRole !== Role.Retailer) {
      throw new Error("You don't have enough permission to perform this operation.");
    }

    const { title, category, quantity, price, productImage } = args;

    if (!title?.trim() || !category?.trim() || quantity == null || !price?.trim()) {
      throw new Error('All fields must be non-empty.');
    }

    const categoryDoc = await CategoryModel.findById(category).lean();
    if (!categoryDoc) {
      throw new Error('Category not found.');
    }

    const newProduct = new Product({
      title: title.trim(),
      category: categoryDoc,
      quantity,
      price: price.trim(),
      productImage: productImage || null,
    });

    await newProduct.save();

    return newProduct;
  } catch (err: any) {
    logger.error(`Error in addProduct: ${err.message || err}`);
    throw err;
  }
};
