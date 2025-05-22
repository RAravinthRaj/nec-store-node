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

interface GetAllUsersArgs {
  name?: string;
  email?: string;
  skip?: number;
  limit?: number;
  orderBy?: 'ASC' | 'DESC';
}

export const getAllUsers = async (
  _: any,
  { name, email, skip = 0, limit = 10, orderBy = 'ASC' }: GetAllUsersArgs,
  context: Context,
) => {
  const currentRole = (context.req as any).user?.role;
  if (!currentRole) {
    throw new Error('Unauthorized: No token provided.');
  }

  const currentUserId = (context.req as any).user?.id;
  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new Error('User not found.');
  }

  if (currentRole !== Role.Admin) {
    throw new Error("You don't have enough permission to perform this operation.");
  }

  const filter: Record<string, any> = {};

  if (name?.trim()) {
    filter.name = { $regex: name.trim(), $options: 'i' };
  }

  if (email?.trim()) {
    filter.email = { $regex: email.trim(), $options: 'i' };
  }

  const users = await User.find(filter)
    .select('_id email rollNumber name roles department')
    .sort({ name: orderBy === 'ASC' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  return users;
};
