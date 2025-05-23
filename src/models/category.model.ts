/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

export const CategorySchema: Schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ICategory>('Category', CategorySchema);
