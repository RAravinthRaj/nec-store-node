/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import User from '@/src/models/user.model';
import { Request } from 'express';

interface Context {
  req: Request;
}

export const getRoles = async (_: any, __: any, context: Context): Promise<string[]> => {
  const email = (context.req as any).user?.email;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  return user?.roles || [];
};
