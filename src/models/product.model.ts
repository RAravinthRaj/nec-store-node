/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import mongoose, { Schema, Document } from 'mongoose';
import { CategorySchema } from '@/src/models/category.model';

export interface ICategoryRef {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  title: string;
  category: ICategoryRef;
  quantity: number;
  price: string;
  productImage?: string | null;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: CategorySchema,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IProduct>('Product', ProductSchema);
