/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Role } from '@/src/config/enum.config';
import User from '@/src/models/user.model';
import { Request } from 'express';

interface Context {
  req: Request;
}

interface GetAllUsersArgs {
  name?: string;
  email?: string;
  skip?: number;
  limit?: number;
  orderBy?: 'ASC' | 'DESC';
}

export const getAllUsers = async (
  _: any,
  { name, email, skip = 0, limit, orderBy = 'ASC' }: GetAllUsersArgs,
  context: Context,
) => {
  const inputEmail: string = (context.req as any).user?.email;

  const user = await User.findOne({ email: inputEmail });
  if (!user) {
    throw new Error('User not found.');
  }

  if (!user?.roles || !user?.roles.includes(Role.Admin)) {
    throw new Error(`You don't have enough permission to perform this operation.`);
  }

  const query: any = {};

  if (name?.trim()) {
    query.name = { $regex: name.trim(), $options: 'i' };
  }

  if (email?.trim()) {
    query.email = { $regex: email.trim(), $options: 'i' };
  }

  const finalLimit = limit ?? 10;

  const users = await User.find(query)
    .select('email rollNumber name roles')
    .sort({ name: orderBy === 'ASC' ? 1 : -1 })
    .skip(skip)
    .limit(finalLimit);

  return users;
};
