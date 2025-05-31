/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import Product from '@/src/models/product.model';
import Order from '@/src/models/order.model';
import logger from '@/src/utils/logger';
import { DeliveryStatus, OrderStatus, PaidStatus } from '@/src/config/enum.config';
import { IdService } from '@/src/services/orderId.service';

interface Context {
  req: Request;
}

interface OrderProductInput {
  productId: string;
  quantity: number;
}

interface CreateOrderArgs {
  products: OrderProductInput[];
}

export const createOrder = async (_: any, args: CreateOrderArgs, context: Context) => {
  try {
    const user = (context.req as any)?.user;
    if (!user?.role) {
      throw new Error('Unauthorized: No token provided.');
    }

    const { products } = args;

    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error('Products cannot be empty.');
    }

    const orderItems = [];
    let totalAmount = 0;
    const productItems = [];

    for (const item of products) {
      if (item?.quantity < 0) {
        throw new Error('Product quantity must be non-negative.');
      }

      const product = await Product.findById(item?.productId);
      if (!product) {
        throw new Error(`Product with ID ${item?.productId} not found.`);
      }

      if (product?.quantity < item?.quantity) {
        throw new Error(`Insufficient stock for ${product?.title}.`);
      }

      const totalPrice = item.quantity * product?.price;

      orderItems.push({
        _id: product?._id,
        title: product?.title,
        category: product?.category,
        quantity: item?.quantity,
        price: product?.price,
        productImage: product?.productImage || null,
      });

      totalAmount += totalPrice;

      product.quantity -= item?.quantity;
      productItems.push(product);
    }

    const orderId = await IdService.getInstance().getNextOrderId();
    const newOrder = new Order({
      orderId,
      orderBy: user,
      products: orderItems,
      totalAmount,
      deliveryStatus: DeliveryStatus.NOT_DELIVERED,
      paidStatus: PaidStatus.UNPAID,
      orderStatus: OrderStatus.CREATED,
    });

    await newOrder?.save();

    for (const item of productItems) {
      item?.save();
    }

    return {
      message: 'Order created successfully.',
      order: newOrder,
    };
  } catch (err: any) {
    logger.error(`Error in createOrder: ${err.message || err}`);
    throw err;
  }
};
