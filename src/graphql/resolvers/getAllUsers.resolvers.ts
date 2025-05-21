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

export const getAllUsers = {
  getAllUsers: async (
    {
      name,
      email,
      skip = 0,
      limit,
      orderBy = 'ASC',
    }: {
      name?: string;
      email?: string;
      skip?: number;
      limit?: number;
      orderBy?: 'ASC' | 'DESC';
    },
    context: Context,
  ) => {
    const roles: string[] = (context.req as any).user?.roles;

    if (!roles || !roles.includes('admin')) {
      throw new Error(`You don't have enough permission to perform this operation.`);
    }

    if (limit == null) {
      limit = skip + 10;
    }

    const query: any = {};

    if (name?.trim()) {
      query.name = { $regex: name.trim(), $options: 'i' };
    }

    if (email?.trim()) {
      query.email = { $regex: email.trim(), $options: 'i' };
    }

    const users = await User.find(query)
      .select('email rollNumber name roles')
      .sort({ name: orderBy === 'ASC' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return users;
  },
};
