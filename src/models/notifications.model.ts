/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: String,
    message: String,
    role: {
      type: String,
      enum: ['admin', 'customer', 'retailer'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Notification', notificationSchema);
