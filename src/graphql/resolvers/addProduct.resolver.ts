/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import Product from '@/src/models/product.model';
import CategoryModel from '@/src/models/category.model';
import Notification from '@/src/models/notifications.model';
import User from '@/src/models/user.model';
import { Role } from '@/src/config/enum.config';
import logger from '@/src/utils/logger';
import { ImageBucketService } from '@/src/services/imageBucket.service';

interface Context {
  req: Request;
}

interface AddProductArgs {
  title: string;
  categoryId: string;
  quantity: number;
  price: number;
  productImage?: string;
  __v?: number;
}

export const addProduct = async (_: any, args: AddProductArgs, context: Context) => {
  try {
    const currentRole = (context.req as any)?.user?.role;
    const retailerId = (context.req as any)?.user?._id;

    if (!currentRole) {
      throw new Error('Unauthorized: No token provided.');
    }

    if (currentRole !== Role.Retailer) {
      throw new Error("You don't have enough permission to perform this operation.");
    }

    let { title, categoryId, quantity, price, productImage } = args;

    if (!title?.trim() || !categoryId?.trim() || quantity == null || price == null) {
      throw new Error('All fields must be non-empty.');
    }

    if (quantity < 0 || price < 0) {
      throw new Error('Quantity and price must be non-negative.');
    }

    const categoryDoc = await CategoryModel.findById(categoryId).lean();
    if (!categoryDoc) {
      throw new Error('Category not found.');
    }

    const existingProduct = await Product.findOne({
      title: title.trim(),
      'category.name': categoryDoc.name,
    });
    if (existingProduct) {
      throw new Error(`${title} already exists under ${categoryDoc.name}.`);
    }

    if (productImage) {
      const imageService = ImageBucketService.getInstance();

      if (imageService.isValidBase64Image(productImage)) {
        const updatedProductImage = await imageService.uploadBase64Image(productImage);
        productImage = updatedProductImage;
      } else {
        throw new Error('Invalid base64 image for product image.');
      }
    }

    const newProduct = new Product({
      title: title.trim(),
      category: categoryDoc,
      quantity,
      price,
      productImage: productImage || null,
      createdBy: retailerId,
    });

    await newProduct.save();

    const customers = await User.find({ roles: Role.Customer });
    for (const customer of customers) {
      await Notification.create({
        userId: customer._id,
        message: `New Product "${newProduct.title}" added under ${categoryDoc.name}.`,
        type: 'NEW_PRODUCT',
      });
    }

    return newProduct;
  } catch (err: any) {
    logger.error(`Error in addProduct: ${err.message || err}`);
    throw err;
  }
};
