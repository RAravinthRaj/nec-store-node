import mongoose, { Schema, Document } from 'mongoose';
import { DeliveryStatus, OrderStatus, PaidStatus } from '@/src/config/enum.config';
import { ProductSchema, IProduct } from '@/src/models/product.model';
import { UserSchema, IUser } from '@/src/models/user.model';

export interface IOrder extends Document {
  orderId: string;
  orderBy: string;
  rollNumber: string;
  products: IProduct[];
  totalAmount: number;
  deliveryStatus: DeliveryStatus;
  paidStatus: PaidStatus;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    orderBy: { type: String, required: true },
    rollNumber: { type: String, required: true },
    products: { type: [ProductSchema], required: true },
    totalAmount: { type: Number, required: true },
    deliveryStatus: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.NOT_DELIVERED,
    },
    paidStatus: {
      type: String,
      enum: Object.values(PaidStatus),
      default: PaidStatus.UNPAID,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IOrder>('Order', OrderSchema);
