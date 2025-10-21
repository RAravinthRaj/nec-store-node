import mongoose, { Schema, Document, Types } from 'mongoose';
import { isValidDepartment } from '@/src/utils/utils';
import { Role, UserStatus, Department } from '@/src/config/enum.config';

export interface IUser extends Document {
  email: string;
  rollNumber: string;
  name: string;
  department: Department;
  roles?: Role[];
  profilePicture?: string;
  status: UserStatus;
  recents?: Types.ObjectId[];
}

export const UserSchema: Schema = new Schema<IUser>(
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
    profilePicture: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
    recents: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>('User', UserSchema);
