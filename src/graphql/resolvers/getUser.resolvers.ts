/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Role } from '@/src/config/enum.config';
import User from '@/src/models/user.model';
import { Request } from 'express';
import { userInfo } from 'node:os';

interface Context {
  req: Request;
}

interface GetUserArgs {
  email?: string;
}

export const getUser = async (_: any, { email }: GetUserArgs, context: Context) => {
  const tokenEmail = (context.req as any).user?.email;

  if (!tokenEmail) {
    throw new Error('Unauthorized: No token or user not found.');
  }

  const user = await User.findOne({ email: tokenEmail });

  if (!user) {
    throw new Error('User not found.');
  }

  if (!user.roles?.includes(Role.Admin) && email !== tokenEmail) {
    throw new Error(`You don't have enough permission to perform this operation`);
  }

  if (user.roles?.includes(Role.Admin) && email) {
    const requestedUser = await User.findOne({ email });
    if (!requestedUser) {
      throw new Error(`User with email ${email} not found.`);
    }

    return requestedUser;
  }

  return user;
};
