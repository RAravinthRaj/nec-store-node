/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import Order from '@/src/models/order.model';
import { PaidStatus, DeliveryStatus, OrderStatus, Role } from '@/src/config/enum.config';
import logger from '@/src/utils/logger';

export const updateOrder = async (
  _: any,
  args: { input: { orderId: string; paidStatus?: PaidStatus; deliveryStatus?: DeliveryStatus } },
  context: any,
) => {
  try {
    const currentRole = (context.req as any).user?.role;
    if (!currentRole) {
      throw new Error('Unauthorized: No token provided.');
    }

    if (currentRole !== Role.Retailer) {
      throw new Error("You don't have permission to access this resource.");
    }

    const { orderId, paidStatus, deliveryStatus } = args.input;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.deliveryStatus === DeliveryStatus.DELIVERED) {
      throw new Error('Order has already been delivered.');
    }

    if (order.paidStatus === PaidStatus.UNPAID) {
      if (paidStatus) {
        order.paidStatus = PaidStatus.PAID;
      } else {
        throw new Error('The amount for the Order has not been paid yet.');
      }
    }

    if (deliveryStatus && deliveryStatus === DeliveryStatus.DELIVERED) {
      order.deliveryStatus = deliveryStatus;
    }

    if (order.paidStatus === PaidStatus.PAID && order.deliveryStatus === DeliveryStatus.DELIVERED) {
      order.orderStatus = OrderStatus.COMPLETED;
    }

    await order?.save();

    return {
      message: 'Order Updated successfully.',
      order,
    };
  } catch (err: any) {
    logger.error(`Error in updateOrderStatus: ${err.message || err}`);
    throw err;
  }
};
