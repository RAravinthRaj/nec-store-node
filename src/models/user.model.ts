/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import mongoose, { Schema, Document } from 'mongoose';
import { isValidDepartment } from '@/src/utils/utils';
import { Role } from '@/src/config/enum.config';

export interface IUser extends Document {
  email: string;
  rollNumber: string;
  name: string;
  department: string;
  roles?: Role[];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      validate: {
        validator: isValidDepartment,
        message: (props) => `${props} is not a valid department`,
      },
    },
    roles: {
      type: [String],
      enum: Object.values(Role),
      default: [Role.Customer],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>('User', UserSchema);
