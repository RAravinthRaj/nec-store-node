/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request } from 'express';
import User from '@/src/models/user.model';
import { JwtService } from '@/src/services/jwt.service';
import { Role, UserStatus } from '@/src/config/enum.config';

interface Context {
  req: Request;
}

interface UpdateUserInput {
  id?: string;
  email?: string;
  name?: string;
  rollNumber?: string;
  department?: string;
  profilePicture?: string | null;
  roles?: Role[];
  status?: UserStatus;
}

export const updateUser = async (
  _: any,
  { input }: { input: UpdateUserInput },
  context: Context,
) => {
  const currentRole = (context.req as any).user?.role;
  if (!currentRole) {
    throw new Error('Unauthorized: No token provided.');
  }

  const currentUserId = (context.req as any).user?.id;
  const tokenUser = await User.findById(currentUserId);

  if (!tokenUser) throw new Error('User not found.');

  const isAdmin = currentRole === Role.Admin;
  let targetUser = tokenUser;

  if (!isAdmin && (input.roles !== undefined || input.status !== undefined)) {
    throw new Error("You don't have enough permission to perform this operation.");
  }

  if (input.id && input.id !== tokenUser.id) {
    if (!isAdmin) {
      throw new Error("You don't have enough permission to perform this operation.");
    }

    const foundUser = await User.findById(input.id);
    if (!foundUser) throw new Error('User not found.');
    targetUser = foundUser;
  }

  const fieldsToUpdate: Partial<UpdateUserInput> = {
    ...(input.name && { name: input.name }),
    ...(input.email && { email: input.email }),
    ...(input.rollNumber && { rollNumber: input.rollNumber }),
    ...(input.department && { department: input.department }),
    ...(input.profilePicture !== undefined && { profilePicture: input.profilePicture }),
  };

  if (isAdmin && input.id && input.id !== tokenUser.id) {
    if (input.roles) {
      const oldRoles = targetUser.roles ?? [];
      const mergedRoles = Array.from(new Set([...oldRoles, ...input.roles]));
      fieldsToUpdate.roles = mergedRoles;
    }

    if (input.status) {
      fieldsToUpdate.status = input.status;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    targetUser._id,
    { $set: fieldsToUpdate },
    { new: true },
  );

  if (!updatedUser) throw new Error('User update failed.');

  const isSelfUpdate = updatedUser.id.toString() === tokenUser.id.toString();
  const updatedSelfFields = input.name || input.rollNumber || input.department || input.email;

  let newToken: string | undefined;
  if (isSelfUpdate && updatedSelfFields) {
    const payload = {
      id: updatedUser.id,
      name: updatedUser.name,
      rollNumber: updatedUser.rollNumber,
      department: updatedUser.department,
      email: updatedUser.email,
      role: currentRole,
    };
    newToken = JwtService.getInstance().generateToken(payload, false);
  }

  return {
    message: 'User updated successfully.',
    token: newToken,
  };
};
