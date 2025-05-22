/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import { Role } from '@/src/config/enum.config';
import User from '@/src/models/user.model';

interface Context {
  req: Request;
}

interface GetUserArgs {
  id?: string;
}

export const getUser = async (_: any, { id }: GetUserArgs, context: Context) => {
  const currentRole = (context.req as any).user?.role;
  if (!currentRole) {
    throw new Error('Unauthorized: No token provided.');
  }

  const tokenUserId = (context.req as any).user?.id;
  const tokenUser = await User.findById(tokenUserId);
  if (!tokenUser) {
    throw new Error('User not found.');
  }

  const isAdmin = currentRole === Role.Admin;

  if (!isAdmin && id && tokenUser.id.toString() !== id) {
    throw new Error("You don't have permission to perform this operation.");
  }

  if (isAdmin && id) {
    const requestedUser = await User.findById(id);
    if (!requestedUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    return requestedUser;
  }

  return tokenUser;
};
