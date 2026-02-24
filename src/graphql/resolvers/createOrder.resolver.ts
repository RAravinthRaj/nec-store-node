/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/

import { Request } from 'express';
import Product from '@/src/models/product.model';
import Order from '@/src/models/order.model';
import Notification from '@/src/models/notifications.model';
import User from '@/src/models/user.model';
import logger from '@/src/utils/logger';
import { DeliveryStatus, OrderStatus, PaidStatus, Role } from '@/src/config/enum.config';
import { IdService } from '@/src/services/orderId.service';
import { config } from '@/src/config/config';

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

    // Prepare order items and calculate total
    const orderItems = [];
    let totalAmount = 0;
    const productItemsToUpdate: any[] = [];

    for (const item of products) {
      if (!item?.productId) throw new Error('Product ID is required');
      if (item?.quantity <= 0) throw new Error('Quantity must be greater than 0');

      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}`);
      }

      const totalPrice = product.price * item.quantity;

      orderItems.push({
        _id: product._id,
        title: product.title,
        category: product.category,
        quantity: item.quantity,
        price: product.price,
        productImage: product.productImage || null,
      });

      totalAmount += totalPrice;

      // Deduct stock
      product.quantity -= item.quantity;
      productItemsToUpdate.push(product);
    }

    // Generate order ID
    const orderId = await IdService.getInstance().getNextOrderId();

    // Create new order
    const newOrder = new Order({
      orderId,
      orderBy: user.id,
      rollNumber: user.rollNumber,
      products: orderItems,
      totalAmount,
      deliveryStatus: DeliveryStatus.NOT_DELIVERED,
      paidStatus: PaidStatus.UNPAID,
      orderStatus: OrderStatus.CREATED,
    });

    await newOrder.save();

    // Update all products stock
    for (const product of productItemsToUpdate) {
      await product.save();
    }

    const retailers = await User.find({ roles: Role.Retailer });

    if (retailers.length === 0) {
      logger.warn('No retailers found to send notifications');
    }

    for (const retailer of retailers) {
      try {
        await Notification.create({
          userId: retailer._id,
          message: `New order received from ${user.name || user.rollNumber} containing ${orderItems.length} item${orderItems.length > 1 ? 's' : ''}.`,
          type: 'NEW_ORDER',
        });
        logger.info(`Notification sent to retailer ${retailer._id}`);
      } catch (err: any) {
        logger.error(
          `Failed to create notification for retailer ${retailer._id}: ${err.message || err}`,
        );
      }
    }

    for (const product of productItemsToUpdate) {
      if (product.quantity <= config.threshold) {
        for (const retailer of retailers) {
          try {
            await Notification.create({
              userId: retailer._id,
              message: `Stock alert: The product "${product.title}" has fallen below the threshold. Remaining quantity: ${product.quantity}.`,
              type: 'STOCK_INSUFFICIENT',
            });
            logger.info(`Notification sent to retailer ${retailer._id}`);
          } catch (err: any) {
            logger.error(
              `Failed to create notification for retailer ${retailer._id}: ${err.message || err}`,
            );
          }
        }
      }
    }

    return {
      message: 'Order created successfully',
      order: newOrder,
    };
  } catch (err: any) {
    logger.error(`Error in createOrder: ${err.message || err}`);
    throw new Error(err.message || 'Failed to create order');
  }
};
