/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import Product, { ICategoryRef } from '@/src/models/product.model';
import CategoryModel from '@/src/models/category.model';
import { Role } from '@/src/config/enum.config';
import logger from '@/src/utils/logger';
import { ImageBucketService } from '@/src/services/imageBucket.service';

interface Context {
  req: Request;
}

interface UpdateProductInput {
  id: string;
  title?: string;
  categoryId?: string;
  quantity?: number;
  price?: number;
  productImage?: string;
}

export const updateProduct = async (
  _: any,
  args: { input: UpdateProductInput },
  context: Context,
) => {
  try {
    const currentRole = (context.req as any)?.user?.role;
    if (!currentRole) {
      throw new Error('Unauthorized: No token provided.');
    }

    if (currentRole !== Role.Retailer) {
      throw new Error("You don't have enough permission to perform this operation.");
    }

    const { id, title, categoryId, quantity, price, productImage } = args.input;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found.');
    }

    if ((quantity !== undefined && quantity < 0) || (price !== undefined && price < 0)) {
      throw new Error('Quantity or price must be non-negative');
    }

    if (title?.trim()) existingProduct.title = title.trim();
    if (quantity !== undefined && quantity > 0) existingProduct.quantity = quantity;
    if (price !== undefined && price > 0) existingProduct.price = price;
    if (productImage) {
      const imageService = ImageBucketService.getInstance();

      if (imageService.isValidBase64Image(productImage)) {
        const updatedProductImage = await imageService.uploadBase64Image(productImage);

        existingProduct.productImage = updatedProductImage;
      } else {
        throw new Error('Invalid base64 image for profilePicture.');
      }
    }

    if (categoryId?.trim()) {
      const categoryDoc = await CategoryModel.findById(categoryId);
      if (!categoryDoc) {
        throw new Error('Category not found.');
      }

      existingProduct.category = categoryDoc as unknown as ICategoryRef;
    }

    await existingProduct.save();

    return {
      message: 'Product updated successfully.',
    };
  } catch (err: any) {
    logger.error(`Error in updateProduct: ${err.message || err}`);
    throw err;
  }
};
