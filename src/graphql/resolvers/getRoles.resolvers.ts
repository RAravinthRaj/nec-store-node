/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import User from '@/src/models/user.model';

interface Context {
  req: Request;
}

export const getRoles = async (_: any, __: any, context: Context): Promise<string[]> => {
  const id = (context.req as any).user?.id;

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  return user?.roles || [];
};
