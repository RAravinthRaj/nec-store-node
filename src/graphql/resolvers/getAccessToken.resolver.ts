/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import User from '@/src/models/user.model';
import { JwtService } from '@/src/services/jwt.service';
import { Role } from '@/src/config/enum.config';
import logger from '@/src/utils/logger';

interface Context {
  req: Request;
}

interface AccessTokenArgs {
  role: Role;
}

export const getAccessToken = async (
  _: any,
  { role }: AccessTokenArgs,
  context: Context,
): Promise<{ role?: string; token?: string }> => {
  try {
    const userId = (context.req as any).user?.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const userRoles = user?.roles;
    if (!userRoles || !userRoles?.includes(role)) {
      throw new Error('Unauthorized.');
    }

    const payload = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      rollNumber: user?.rollNumber,
      department: user?.department,
      profilePicture: user?.profilePicture,
      role: role,
    };

    const newToken = JwtService.getInstance().generateToken(payload, false);

    return {
      role,
      token: newToken,
    };
  } catch (err: any) {
    logger.error(`Error in getAccessToken : ${err}`);
    throw err;
  }
};
