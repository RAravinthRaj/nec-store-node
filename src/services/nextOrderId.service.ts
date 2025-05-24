/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import Counter from '@/src/models/counter.model';

export const nextOrderId = async (): Promise<string> => {
  const result = await Counter.findByIdAndUpdate(
    'orderId',
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true },
  );

  const count = result?.sequence_value ?? 1;
  return `NEC${String(count).padStart(4, '0')}`;
};
